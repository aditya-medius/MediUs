"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorsOffDays = exports.getDoctorsOffDaysForADateRange = exports.getDoctorsInHospitalByQuery = exports.setSpecializationActiveStatus = exports.getDoctorsHolidayByQuery = exports.getDoctorInfo = exports.canDoctorTakeMoreAppointments = exports.isDateHolidayForDoctor = exports.getDoctorWorkingDays = exports.getDoctorById_ForSuvedha = exports.getDoctorsWithAdvancedFilters = exports.getMyLikes = exports.unlikeDoctor = exports.likeDoctor = exports.checkIfDoctorIsAvailableOnTheDay = exports.getDoctorFeeInHospital = exports.getAppointmentFeeFromAppointmentId = exports.getListOfAllAppointments = exports.getDoctorsOfflineAndOnlineAppointments = exports.setConsultationFeeForDoctor = exports.getAgeOfDoctor = exports.getDoctorToken = exports.getPendingAmount = exports.getWithdrawanAmount = exports.getAvailableAmount = exports.getTotalEarnings = exports.getUser = exports.WEEKDAYS = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppointmentPayment_Model_1 = __importDefault(require("../../Models/AppointmentPayment.Model"));
const CreditAmount_Model_1 = __importDefault(require("../../Models/CreditAmount.Model"));
const Withdrawal_Model_1 = __importDefault(require("../../Models/Withdrawal.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const Doctors_Model_1 = __importDefault(require("../../Models/Doctors.Model"));
const Appointment_Model_1 = __importDefault(require("../../Models/Appointment.Model"));
const Utils_1 = require("../Utils");
const Doctor_Controller_1 = require("../../Controllers/Doctor.Controller");
const schemaNames_1 = require("../schemaNames");
const Holiday_Calendar_Model_1 = __importDefault(require("../../Models/Holiday-Calendar.Model"));
const Likes_Model_1 = __importDefault(require("../../Models/Likes.Model"));
const _ = __importStar(require("lodash"));
const likeService = __importStar(require("../../Services/Like/Like.service"));
const Suvedha_Service_1 = require("../Suvedha/Suvedha.Service");
const Admin_Service_1 = require("../Admin/Admin.Service");
const WorkingHours_Model_1 = __importDefault(require("../../Models/WorkingHours.Model"));
const Specialization_Model_1 = __importDefault(require("../../Admin Controlled Models/Specialization.Model"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
const Helpers_1 = require("../Helpers");
dotenv.config();
exports.WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];
const getUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return req.currentDoctor ? req.currentDoctor : req.currentHospital;
});
exports.getUser = getUser;
const getTotalEarnings = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const totalEarnings = yield CreditAmount_Model_1.default.aggregate([
        {
            $lookup: {
                from: "orders",
                localField: "orderId",
                foreignField: "_id",
                as: "orderId",
            },
        },
        {
            $unwind: {
                path: "$orderId",
            },
        },
        {
            $lookup: {
                from: "appointments",
                localField: "orderId.appointmentDetails",
                foreignField: "_id",
                as: "orderId.appointmentDetails",
            },
        },
        {
            $unwind: {
                path: "$orderId.appointmentDetails",
            },
        },
        {
            $match: {
                "orderId.appointmentDetails.doctors": new mongoose_1.default.Types.ObjectId(id),
            },
        },
        {
            $group: {
                _id: "$orderId.appointmentDetails.doctors",
                totalEarnings: {
                    $sum: "$orderId.amount",
                },
            },
        },
    ]);
    return totalEarnings;
});
exports.getTotalEarnings = getTotalEarnings;
const getAvailableAmount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Promise_TotalEarning = (0, exports.getTotalEarnings)(id);
        const Promise_PendingAmount = (0, exports.getPendingAmount)(id);
        let [totalEarning, pendingAmount] = yield Promise.all([
            Promise_TotalEarning,
            Promise_PendingAmount,
        ]);
        totalEarning = totalEarning[0] ? totalEarning[0].totalEarnings : null;
        pendingAmount = pendingAmount[0] ? pendingAmount[0].pendingAmount : null;
        return Promise.resolve();
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getAvailableAmount = getAvailableAmount;
const getWithdrawanAmount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Withdrawal_Model_1.default.aggregate([
            {
                $match: {
                    withdrawnBy: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $group: {
                    _id: "$user",
                    withdrawnAmount: {
                        $sum: "$withdrawalAmount",
                    },
                },
            },
        ]);
        return Promise.resolve(data);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getWithdrawanAmount = getWithdrawanAmount;
const getPendingAmount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Promise_TotalEarning = (0, exports.getTotalEarnings)(id);
        const Promise_WithdrawnAmount = (0, exports.getWithdrawanAmount)(id);
        let [totalEarning, withdrawnAmount] = yield Promise.all([
            Promise_TotalEarning,
            Promise_WithdrawnAmount,
        ]);
        totalEarning = totalEarning[0] ? totalEarning[0].totalEarnings : null;
        withdrawnAmount = withdrawnAmount[0]
            ? withdrawnAmount[0].withdrawnAmount
            : null;
        if (!totalEarning) {
            return Promise.reject("You have not earned anything");
        }
        else if (!withdrawnAmount) {
            return Promise.resolve(totalEarning);
        }
        return Promise.resolve(totalEarning - withdrawnAmount);
    }
    catch (error) {
        throw error;
    }
});
exports.getPendingAmount = getPendingAmount;
const getDoctorToken = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwt.sign(body, process.env.SECRET_DOCTOR_KEY);
    return token;
});
exports.getDoctorToken = getDoctorToken;
const getAgeOfDoctor = (dob) => {
    const exp = (0, moment_1.default)(new Date(dob));
    const currentDate = (0, moment_1.default)(new Date());
    let age = currentDate.diff(exp, "years", true);
    if (age < 1) {
        age = currentDate.diff(exp, "months");
    }
    return age;
};
exports.getAgeOfDoctor = getAgeOfDoctor;
const setConsultationFeeForDoctor = (doctorId, hospitalId, consultationFee) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield Doctors_Model_1.default.findOneAndUpdate({
            _id: doctorId,
            "hospitalDetails.hospital": hospitalId,
        }, {
            $set: {
                "hospitalDetails.$.consultationFee": consultationFee,
            },
        });
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.setConsultationFeeForDoctor = setConsultationFeeForDoctor;
const getDoctorsOfflineAndOnlineAppointments = (doctorId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!doctorId) {
            return Promise.reject("Give a doctor's Id");
        }
        let [startDate, endDate] = (0, Utils_1.getRangeOfDates)(body.year, body.month);
        let offlineAppointments = Appointment_Model_1.default.aggregate([
            {
                $match: {
                    $and: [
                        {
                            doctors: new mongoose_1.default.Types.ObjectId(doctorId),
                        },
                        {
                            Type: "Offline",
                        },
                        {
                            "time.date": { $gte: startDate, $lt: endDate },
                        },
                    ],
                },
            },
            {
                $count: "offline",
            },
            {
                $unwind: "$offline",
            },
        ]);
        let onlineAppointments = Appointment_Model_1.default.aggregate([
            {
                $match: {
                    $and: [
                        {
                            doctors: new mongoose_1.default.Types.ObjectId(doctorId),
                        },
                        {
                            Type: "Online",
                        },
                        {
                            "time.date": { $gte: startDate, $lt: endDate },
                        },
                    ],
                },
            },
            {
                $count: "online",
            },
            {
                $unwind: "$online",
            },
        ]);
        // let appointments = await appointmentModel.aggregate([
        //   {
        //     $facet: {
        //       offline: [
        //         {
        //           $match: {
        //             $and: [
        //               {
        //                 Type: "Offline",
        //               },
        //               {
        //                 "time.date": { $gte: startDate, $lt: endDate },
        //               },
        //             ],
        //           },
        //         },
        //         // {
        //         //   $count: "offline",
        //         // },
        //       ],
        //       online: [
        //         {
        //           $match: {
        //             $and: [
        //               {
        //                 Type: "Online",
        //               },
        //               {
        //                 "time.date": { $gte: startDate, $lt: endDate },
        //               },
        //             ],
        //           },
        //         },
        //         // {
        //         //   $count: "online",
        //         // },
        //       ],
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: "$offline",
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: "$online",
        //     },
        //   },
        // ]);
        let appointments = yield Promise.all([
            offlineAppointments,
            onlineAppointments,
        ]);
        return Promise.resolve(appointments.map((e) => e[0]));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsOfflineAndOnlineAppointments = getDoctorsOfflineAndOnlineAppointments;
const getListOfAllAppointments = (doctorId, page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = 10;
        const skip = parseInt(page) * limit;
        let appointmentsInThisHospital = yield Appointment_Model_1.default.aggregate([
            {
                $match: {
                    doctors: new mongoose_1.default.Types.ObjectId(doctorId),
                },
            },
            {
                $lookup: {
                    from: schemaNames_1.patient,
                    localField: "patient",
                    foreignField: "_id",
                    as: "patient",
                },
            },
            {
                $unwind: "$patient",
            },
            {
                $unwind: "$hospital",
            },
            {
                $lookup: {
                    from: schemaNames_1.hospital,
                    localField: "hospital",
                    foreignField: "_id",
                    as: "hospital",
                },
            },
            {
                $lookup: {
                    from: schemaNames_1.doctor,
                    localField: "doctors",
                    foreignField: "_id",
                    as: "doctors",
                },
            },
            {
                $lookup: {
                    from: schemaNames_1.specialization,
                    localField: "doctors.specialization",
                    foreignField: "_id",
                    as: "specials",
                },
            },
            // {
            //   $unwind: "doctors.specialization",
            // },
            {
                $unwind: "$doctors",
            },
            {
                $unwind: "$hospital",
            },
            {
                $project: {
                    "patient.firstName": 1,
                    "patient.lastName": 1,
                    "patient.DOB": 1,
                    "patient.gender": 1,
                    "patient.phoneNumber": 1,
                    "hospital.name": 1,
                    "hospital.address": 1,
                    "doctors.firstName": 1,
                    "doctors.lastName": 1,
                    // "doctors.specialization": 1,
                    specials: 1,
                    createdAt: 1,
                    appointmentToken: 1,
                    appointmentId: 1,
                    appointmentType: 1,
                    Type: 1,
                    done: 1,
                    cancelled: 1,
                    rescheduled: 1,
                    time: 1,
                },
            },
            {
                $addFields: {
                    "patient.age": {
                        $function: {
                            body: function (dob) {
                                dob = new Date(dob);
                                let currentDate = new Date();
                                let age = currentDate.getFullYear() - dob.getFullYear();
                                if (age > 0) {
                                    age = `${age} years`;
                                }
                                else {
                                    age = `${age} months`;
                                }
                                return age;
                            },
                            lang: "js",
                            args: ["$patient.DOB"],
                        },
                    },
                    "doctors.specialization": "$specials",
                },
            },
            {
                $sort: {
                    "time.date": -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);
        return Promise.resolve(appointmentsInThisHospital);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getListOfAllAppointments = getListOfAllAppointments;
const getAppointmentFeeFromAppointmentId = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appointment = yield AppointmentPayment_Model_1.default
            .findOne({
            appointmentId: appointmentId,
        })
            .populate("orderId")
            .lean();
        return Promise.resolve(appointment);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getAppointmentFeeFromAppointmentId = getAppointmentFeeFromAppointmentId;
const getDoctorFeeInHospital = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fee = (yield Doctors_Model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(doctorId),
                },
            },
            {
                $project: {
                    hospitalDetails: 1,
                },
            },
        ]))[0];
        fee = fee.hospitalDetails
            .filter((e) => {
            return e.hospital.toString() === hospitalId;
        })
            .map((e) => e.consultationFee);
        return Promise.resolve({ consultationFee: fee[0] });
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorFeeInHospital = getDoctorFeeInHospital;
const checkIfDoctorIsAvailableOnTheDay = (date, month, year, doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        month = month - 1;
        let startDate = new Date(year, month, date);
        let endDate = new Date(year, month, date + 1);
        let holidayExist = yield Holiday_Calendar_Model_1.default.findOne({
            doctorId,
            hospitalId,
            date: { $gte: startDate, $lte: endDate },
            "delData.deleted": false,
        });
        return Promise.resolve(holidayExist);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.checkIfDoctorIsAvailableOnTheDay = checkIfDoctorIsAvailableOnTheDay;
const likeDoctor = (likedDoctorId, likedById, reference = schemaNames_1.patient) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let likeExist = yield likeService.likeExist(likedDoctorId, likedById);
        if (!likeExist) {
            let liked = yield new Likes_Model_1.default({
                doctor: likedDoctorId,
                likedBy: likedById,
                reference,
            }).save();
            return Promise.resolve(true);
        }
        else {
            let { unlike, _id } = yield likeService.getLikeById(likedDoctorId, likedById);
            if (unlike) {
                Likes_Model_1.default.findOneAndUpdate({ _id }, { $set: { unlike: false } });
            }
            else {
                Likes_Model_1.default.findOneAndUpdate({ _id }, { $set: { unlike: true } });
            }
            return Promise.resolve(!unlike);
            // return Promise.resolve(true);
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.likeDoctor = likeDoctor;
const unlikeDoctor = (likedDoctorId, likedById, reference = schemaNames_1.patient) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let likeExist = yield likeService.likeExist(likedDoctorId, likedById);
        if (!likeExist) {
            return Promise.reject("You have not liked this doctor");
        }
        else {
            let unlike = yield Likes_Model_1.default.findOneAndUpdate({
                doctor: likedDoctorId,
                likedBy: likedById,
                reference,
            }, {
                $set: {
                    unlike: true,
                },
            });
            return Promise.resolve(unlike ? false : true);
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.unlikeDoctor = unlikeDoctor;
const getMyLikes = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let likes = yield Likes_Model_1.default
            .find({
            doctor: doctorId,
            $or: [{ unlike: { $exists: false } }, { unlike: false }],
        })
            .populate({ path: "doctor", select: Doctor_Controller_1.excludeDoctorFields })
            .populate({ path: "likedBy", select: "-password" });
        return Promise.resolve(likes);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getMyLikes = getMyLikes;
const getDoctorsWithAdvancedFilters = function (userId, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { gender, experience, city, name, specialization } = query;
            let aggregate = [
                {
                    $match: {},
                },
            ];
            if (city) {
                city = yield (0, Admin_Service_1.getCityIdFromName)(city);
            }
            if (specialization) {
                specialization = yield (0, Admin_Service_1.getSpecialization)(specialization);
            }
            city && aggregate.push(...(0, Suvedha_Service_1.createCityFilterForDoctor)(city._id));
            gender && aggregate.push(...(0, Suvedha_Service_1.createGenderFilterForDoctor)(gender));
            name && aggregate.push(...(0, Suvedha_Service_1.createNameFilterForDoctor)(name));
            specialization &&
                aggregate.push(...(0, Suvedha_Service_1.createSpecilizationFilterForDoctor)(specialization._id));
            let doctors = yield Doctors_Model_1.default.aggregate([
                ...aggregate,
                {
                    $lookup: {
                        from: schemaNames_1.like,
                        localField: "_id",
                        foreignField: "doctor",
                        as: "like",
                    },
                },
                {
                    $addFields: {
                        liked: {
                            $filter: {
                                input: "$like",
                                as: "like",
                                cond: {
                                    $eq: ["$$like.likedBy", new mongoose_1.default.Types.ObjectId(userId)],
                                },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "specializations",
                        localField: "specialization",
                        foreignField: "_id",
                        as: "specialization",
                    },
                },
                {
                    $lookup: {
                        from: schemaNames_1.qualification,
                        localField: "qualification",
                        foreignField: "_id",
                        as: "qualification",
                    },
                },
                {
                    $lookup: {
                        from: schemaNames_1.qualificationNames,
                        localField: "qualification.qualificationName",
                        foreignField: "_id",
                        as: "qualificationName",
                    },
                },
                {
                    $addFields: {
                        "qualification.qualificationName": "$qualificationName",
                    },
                },
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        gender: 1,
                        qualification: 1,
                        specialization: 1,
                        image: 1,
                        overallExperience: 1,
                        liked: 1,
                    },
                },
            ]);
            return Promise.resolve(doctors);
        }
        catch (error) {
            return Promise.reject(error);
        }
    });
};
exports.getDoctorsWithAdvancedFilters = getDoctorsWithAdvancedFilters;
const getDoctorById_ForSuvedha = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctor = yield Doctors_Model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(doctorId),
                },
            },
            {
                $lookup: {
                    from: schemaNames_1.hospital,
                    localField: "hospitalDetails.hospital",
                    foreignField: "_id",
                    as: "hospitalDetails.hospital",
                },
            },
        ]);
        return Promise.resolve(doctor);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorById_ForSuvedha = getDoctorById_ForSuvedha;
// Doctor inme se kis date me available hai
// export const getValidDateOfDoctorsSchedule = async (dates: Array<string>) => {
//   try {
//     let days: Array<string> = []
//     dates.forEach((e: string) => {
//       days.push(WEEKDAYS[new Date(e).getDay()])
//       days = [...new Set(days)]
//     })
//     return Promise.resolve({})
//   } catch (error: any) {
//     return Promise.reject(error)
//   }
// }
const getDoctorWorkingDays = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let days = yield WorkingHours_Model_1.default.find({ doctorDetails: doctorId, "deleted.isDeleted": false }, "-doctorDetails -hospitalDetails -byHospital -deleted");
        return Promise.resolve(days);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorWorkingDays = getDoctorWorkingDays;
// Doctor ki in dates me chutti hai kya?
const isDateHolidayForDoctor = (dates, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let calendar = yield Holiday_Calendar_Model_1.default.find({ doctorId, date: { $in: dates } });
        return Promise.resolve(calendar.map((e) => e.date));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.isDateHolidayForDoctor = isDateHolidayForDoctor;
// Doctor in dates me aur appointments le skta hai?
const canDoctorTakeMoreAppointments = (date, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appointments = [];
        date.forEach((e) => {
            let d = new Date(e);
            let gtDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            let ltDate = new Date(gtDate);
            gtDate.setDate(gtDate.getDate() + 1);
            gtDate.setUTCHours(18, 30, 0, 0);
            appointments.push(Appointment_Model_1.default.find({
                doctors: doctorId,
                "time.date": {
                    $gte: ltDate,
                    $lte: gtDate,
                },
            }));
        });
        let data = (yield Promise.all(appointments)).flat();
        return Promise.resolve(data.map((e) => e.time.date));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.canDoctorTakeMoreAppointments = canDoctorTakeMoreAppointments;
const getDoctorInfo = (doctorId, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const time = new Date(date);
        let d = time.getDay();
        let day = exports.WEEKDAYS[d - 1];
        let common = [
            {
                $lookup: {
                    from: schemaNames_1.hospital,
                    localField: "hospitalDetails",
                    foreignField: "_id",
                    as: "hospitalDetails",
                },
            },
            {
                $unwind: "$hospitalDetails",
            },
            {
                $lookup: {
                    from: schemaNames_1.address,
                    localField: "hospitalDetails.address",
                    foreignField: "_id",
                    as: "hospitalDetails.address",
                },
            },
            {
                $lookup: {
                    from: schemaNames_1.locality,
                    localField: "hospitalDetails.address.locality",
                    foreignField: "_id",
                    as: "hospitalDetails.address.locality",
                },
            },
            {
                $lookup: {
                    from: schemaNames_1.doctor,
                    localField: "doctorDetails",
                    foreignField: "_id",
                    as: "doctorDetails",
                },
            },
            {
                $unwind: "$doctorDetails",
            },
            {
                $lookup: {
                    from: "prescriptions",
                    localField: "doctorDetails._id",
                    foreignField: "doctorId",
                    as: "temp",
                },
            },
            {
                $lookup: {
                    from: "holidaycalendars",
                    localField: "doctorDetails._id",
                    foreignField: "doctorId",
                    as: "holidayCalendar",
                },
            },
            {
                $addFields: {
                    "hospitalDetails.prescription": {
                        $function: {
                            body: function (args, id) {
                                return args.filter((e) => e.hospital.toString() === id.toString());
                            },
                            args: ["$doctorDetails.hospitalDetails", "$hospitalDetails._id"],
                            lang: "js",
                        },
                    },
                    "hospitalDetails.validity": {
                        $function: {
                            body: function (args, id) {
                                return args.filter((e) => e.hospitalId.toString() === id.toString());
                            },
                            args: ["$temp", "$hospitalDetails._id"],
                            lang: "js",
                        },
                    },
                    holidayCalendar: {
                        $filter: {
                            input: "$holidayCalendar",
                            as: "holidayCalendar",
                            cond: {
                                $eq: ["$$holidayCalendar.hospitalId", "$hospitalDetails._id"],
                            },
                        },
                    },
                    fee: {
                        $filter: {
                            input: "$doctorDetails.hospitalDetails",
                            as: "fee",
                            cond: {
                                $eq: ["$$fee.hospital", "$hospitalDetails._id"],
                            },
                        },
                    },
                },
            },
        ];
        let doctors = yield WorkingHours_Model_1.default.aggregate([
            {
                $facet: {
                    matchedData: [
                        {
                            $match: {
                                doctorDetails: new mongoose_1.default.Types.ObjectId(doctorId),
                                [day]: { $exists: true },
                            },
                        },
                        ...common,
                        {
                            $addFields: {
                                "hospitalDetails.prescription": {
                                    $function: {
                                        body: function (args, id) {
                                            return args.filter((e) => e.hospital.toString() === id.toString());
                                        },
                                        args: [
                                            "$doctorDetails.hospitalDetails",
                                            "$hospitalDetails._id",
                                        ],
                                        lang: "js",
                                    },
                                },
                                "hospitalDetails.validity": {
                                    $function: {
                                        body: function (args, id) {
                                            return args.filter((e) => e.hospitalId.toString() === id.toString());
                                        },
                                        args: ["$temp", "$hospitalDetails._id"],
                                        lang: "js",
                                    },
                                },
                                holidayCalendar: {
                                    $filter: {
                                        input: "$holidayCalendar",
                                        as: "holidayCalendar",
                                        cond: {
                                            $eq: [
                                                "$$holidayCalendar.hospitalId",
                                                "$hospitalDetails._id",
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    ],
                    unmatchedData: [
                        {
                            $match: {
                                doctorDetails: new mongoose_1.default.Types.ObjectId(doctorId),
                                [day]: { $exists: false },
                            },
                        },
                        ...common,
                        {
                            $addFields: {
                                "hospitalDetails.prescription": "$doctorDetails.hospitalDetails",
                                "hospitalDetails.validity": "$temp",
                                holidayCalendar: {
                                    $filter: {
                                        input: "$holidayCalendar",
                                        as: "holidayCalendar",
                                        cond: {
                                            $eq: [
                                                "$$holidayCalendar.hospitalId",
                                                "$hospitalDetails._id",
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    data: {
                        $setUnion: ["$matchedData", "$unmatchedData"],
                    },
                },
            },
            { $unwind: "$data" },
            { $replaceRoot: { newRoot: "$data" } },
        ]);
        return Promise.resolve(doctors);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorInfo = getDoctorInfo;
const getDoctorsHolidayByQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const time = new Date(date);
        // let year = time.getFullYear(),
        //   month = time.getMonth(),
        //   currentDate = time.getDate();
        // let startDate = new Date(year, month, currentDate);
        // let endDate = new Date(year, month, currentDate + 1);
        // let holiday = await holidayModel.find({
        //   date: { gte: ltDate, $lte: gtDate },
        // });
        let holiday = yield Holiday_Calendar_Model_1.default.find(query);
        return Promise.resolve(holiday);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsHolidayByQuery = getDoctorsHolidayByQuery;
// This function is supposed to be run ony once
const setSpecializationActiveStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let speclizationIds = yield Doctors_Model_1.default
            .find({}, { specialization: 1 })
            .lean();
        speclizationIds = speclizationIds
            .map((e) => e.specialization)
            .flat()
            .map((e) => e.toString());
        speclizationIds = [...new Set(speclizationIds)];
        Specialization_Model_1.default.updateMany({ _id: { $in: speclizationIds } }, { $set: { active: true } });
        return Promise.resolve(speclizationIds);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.setSpecializationActiveStatus = setSpecializationActiveStatus;
const getDoctorsInHospitalByQuery = (query = {}, select = {}) => __awaiter(void 0, void 0, void 0, function* () {
    let doctors = yield Hospital_Model_1.default.find(query, select).populate("doctors");
    return doctors;
});
exports.getDoctorsInHospitalByQuery = getDoctorsInHospitalByQuery;
function getDatesMatchingDays(startDate, endDate, daysOfWeek) {
    let matchingDates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
        const dayName = currentDate.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
        if (_.includes(daysOfWeek, dayName)) {
            matchingDates.push(currentDate.toISOString()); // Format date as YYYY-MM-DD
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    return matchingDates;
}
const getDoctorsOffDaysForADateRange = (workingDays, startDate, endDate) => {
    const offDays = (0, exports.getDoctorsOffDays)(workingDays);
    const offDates = getDatesMatchingDays(startDate, endDate, offDays);
    return { offDays, offDates };
};
exports.getDoctorsOffDaysForADateRange = getDoctorsOffDaysForADateRange;
const getDoctorsOffDays = (workingDays) => {
    let workingDaysForADoctorInHospital = [];
    workingDays.forEach((data) => {
        let workingDaysForOneRecord = Helpers_1.Weekdays.filter((weekday) => {
            if (data.hasOwnProperty(weekday)) {
                return weekday;
            }
        });
        workingDaysForADoctorInHospital.push(...workingDaysForOneRecord);
    });
    const offDays = _.difference(Helpers_1.Weekdays, workingDaysForADoctorInHospital);
    return offDays;
};
exports.getDoctorsOffDays = getDoctorsOffDays;
