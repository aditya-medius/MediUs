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
exports.getAppointmentFeeFromAppointmentId = exports.getListOfAllAppointments = exports.getDoctorsOfflineAndOnlineAppointments = exports.setConsultationFeeForDoctor = exports.getAgeOfDoctor = exports.getDoctorToken = exports.getPendingAmount = exports.getWithdrawanAmount = exports.getAvailableAmount = exports.getTotalEarnings = exports.getUser = void 0;
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
const schemaNames_1 = require("../schemaNames");
dotenv.config();
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
    console.log("dsjnbdsDS:", age);
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
