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
exports.markHospitalsAccountAsInactive = exports.markHospitalsAccountAsOnHold = exports.checkIfHospitalHasLoggedInInThePastMonth = exports.checkIfHospitalHasLoggedInThePastWeek = exports.updateHospitalsLastLogin = exports.getHolidayForHospital = exports.addHolidayForHospital = exports.changeAppointmentStatus = exports.getCitiesWhereHospitalsExist = exports.getHospitalById = exports.hospitalsInDoctor = exports.getHospitalsPrescriptionValidityInDoctor = exports.getHospitalsWorkingHourInDoctor = exports.getHolidayTimigsOfHospitalsInDoctor = exports.doctorsInHospital = exports.getDoctorsPrescriptionValidityInHospital = exports.getDoctorsWorkingHourInHospital = exports.getHolidayTimigsOfDoctorsInHospital = exports.doesHospitalExist = exports.generateOrderId = exports.verifyPayment = exports.getPatientsAppointmentsInThisHospital = exports.getPatientFromPhoneNumber = exports.getHospitalsOfflineAndOnlineAppointments = exports.getDoctorsListInHospital_withApprovalStatus = exports.getHospitalsSpecilization_AccordingToDoctor = exports.getHospitalToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
const mongoose_1 = __importDefault(require("mongoose"));
const schemaNames_1 = require("../schemaNames");
const Appointment_Model_1 = __importDefault(require("../../Models/Appointment.Model"));
const Utils_1 = require("../Utils");
const Patient_Model_1 = __importDefault(require("../../Models/Patient.Model"));
const Validation_Service_1 = require("../Validation.Service");
const Patient_Service_1 = require("../Helpers/Patient.Service");
const CreditAmount_Model_1 = __importDefault(require("../../Models/CreditAmount.Model"));
const AppointmentPayment_Model_1 = __importDefault(require("../../Models/AppointmentPayment.Model"));
const orderController = __importStar(require("../../Controllers/Order.Controller"));
const Holiday_Calendar_Model_1 = __importDefault(require("../../Models/Holiday-Calendar.Model"));
const WorkingHours_Model_1 = __importDefault(require("../../Models/WorkingHours.Model"));
const Prescription_Model_1 = __importDefault(require("../../Models/Prescription.Model"));
const Doctors_Model_1 = __importDefault(require("../../Models/Doctors.Model"));
const Helpers_1 = require("../Helpers");
dotenv.config();
const getHospitalToken = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwt.sign(body, process.env.SECRET_HOSPITAL_KEY);
    return token;
});
exports.getHospitalToken = getHospitalToken;
const getHospitalsDoctors_jismeRequestKiHaiOrProfileMeHai = [
    // {
    //   $match: {
    //     _id: new mongoose.Types.ObjectId(hospitalId),
    //   },
    // },
    {
        $project: {
            doctors: 1,
        },
    },
    {
        $lookup: {
            from: "approvalrequests",
            localField: "_id",
            foreignField: "requestFrom",
            as: "approval",
        },
    },
    {
        $unwind: {
            path: "$approval",
        },
    },
    {
        $project: {
            doctors: 1,
            approval: 1,
        },
    },
    {
        $project: {
            doctors: 1,
            approval: {
                $function: {
                    body: function (approval) {
                        let data = [approval.requestTo];
                        return data;
                    },
                    lang: "js",
                    args: ["$approval"],
                },
            },
        },
    },
    {
        $project: {
            doctors: {
                $setUnion: ["$doctors", "$approval"],
            },
        },
    },
    {
        $lookup: {
            from: "doctors",
            localField: "doctors",
            foreignField: "_id",
            as: "doctors",
        },
    },
    {
        $unwind: {
            path: "$doctors",
        },
    },
];
const getHospitalsSpecilization_AccordingToDoctor = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let specializaitons = yield Hospital_Model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(hospitalId),
                },
            },
            ...getHospitalsDoctors_jismeRequestKiHaiOrProfileMeHai,
            {
                $project: {
                    "doctors.specialization": 1,
                },
            },
            {
                $lookup: {
                    from: "specializations",
                    localField: "doctors.specialization",
                    foreignField: "_id",
                    as: "specialization",
                },
            },
            {
                $unwind: {
                    path: "$specialization",
                },
            },
            {
                $project: {
                    specialization: 1,
                },
            },
            {
                $project: {
                    "specialization._id": 1,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    specializations: {
                        $addToSet: "$specialization._id",
                    },
                },
            },
            {
                $lookup: {
                    from: "specializations",
                    localField: "specializations",
                    foreignField: "_id",
                    as: "specializations",
                },
            },
        ]);
        return Promise.resolve(specializaitons);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHospitalsSpecilization_AccordingToDoctor = getHospitalsSpecilization_AccordingToDoctor;
const getDoctorsListInHospital_withApprovalStatus = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctors = yield Hospital_Model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(hospitalId),
                },
            },
            {
                $facet: {
                    approved: [
                        {
                            $lookup: {
                                from: "approvalrequests",
                                localField: "_id",
                                foreignField: "requestFrom",
                                as: "approved",
                            },
                        },
                        {
                            $project: {
                                "approved.requestTo": 1,
                                "approved.approvalStatus": 1,
                            },
                        },
                        {
                            $unwind: "$approved",
                        },
                        {
                            $lookup: {
                                from: "doctors",
                                localField: "approved.requestTo",
                                foreignField: "_id",
                                as: "approved.doctor",
                            },
                        },
                        {
                            $unwind: "$approved.doctor",
                        },
                        {
                            $addFields: {
                                doctor: "$approved.doctor",
                            },
                        },
                        {
                            $lookup: {
                                from: schemaNames_1.qualification,
                                localField: "doctor.qualification",
                                foreignField: "_id",
                                as: "doctor.qualification",
                            },
                        },
                        {
                            $lookup: {
                                from: schemaNames_1.qualificationNames,
                                localField: "doctor.qualification.qualificationName",
                                foreignField: "_id",
                                as: "doctor.qualification.qualificationName",
                            },
                        },
                        {
                            $lookup: {
                                from: schemaNames_1.specialization,
                                localField: "doctor.specialization",
                                foreignField: "_id",
                                as: "doctor.specialization",
                            },
                        },
                        {
                            $addFields: {
                                status: "$approved.approvalStatus",
                                experience: {
                                    $function: {
                                        body: function (experience) {
                                            experience = new Date(experience);
                                            let currentDate = new Date();
                                            let age = currentDate.getFullYear() - experience.getFullYear();
                                            if (age > 0) {
                                                age = `${age} years`;
                                            }
                                            else {
                                                age = `${age} months`;
                                            }
                                            return age;
                                        },
                                        lang: "js",
                                        args: ["$doctor.overallExperience"],
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                approved: 0,
                            },
                        },
                    ],
                    requestTo: [
                        {
                            $lookup: {
                                from: "approvalrequests",
                                localField: "_id",
                                foreignField: "requestTo",
                                as: "approved",
                            },
                        },
                        {
                            $project: {
                                "approved.requestFrom": 1,
                                "approved.approvalStatus": 1,
                            },
                        },
                        {
                            $unwind: "$approved",
                        },
                        {
                            $lookup: {
                                from: "doctors",
                                localField: "approved.requestFrom",
                                foreignField: "_id",
                                as: "approved.doctor",
                            },
                        },
                        {
                            $unwind: "$approved.doctor",
                        },
                        {
                            $addFields: {
                                doctor: "$approved.doctor",
                            },
                        },
                        {
                            $lookup: {
                                from: schemaNames_1.qualification,
                                localField: "doctor.qualification",
                                foreignField: "_id",
                                as: "doctor.qualification",
                            },
                        },
                        {
                            $lookup: {
                                from: schemaNames_1.qualificationNames,
                                localField: "doctor.qualification.qualificationName",
                                foreignField: "_id",
                                as: "doctor.qualification.qualificationName",
                            },
                        },
                        {
                            $lookup: {
                                from: schemaNames_1.specialization,
                                localField: "doctor.specialization",
                                foreignField: "_id",
                                as: "doctor.specialization",
                            },
                        },
                        {
                            $addFields: {
                                status: "$approved.approvalStatus",
                                experience: {
                                    $function: {
                                        body: function (experience) {
                                            experience = new Date(experience);
                                            let currentDate = new Date();
                                            let age = currentDate.getFullYear() - experience.getFullYear();
                                            if (age > 0) {
                                                age = `${age} years`;
                                            }
                                            else {
                                                age = `${age} months`;
                                            }
                                            return age;
                                        },
                                        lang: "js",
                                        args: ["$doctor.overallExperience"],
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                approved: 0,
                            },
                        },
                    ],
                    // doctors: [
                    //   {
                    //     $lookup: {
                    //       from: "doctors",
                    //       localField: "doctors",
                    //       foreignField: "_id",
                    //       as: "doctors",
                    //     },
                    //   },
                    //   {
                    //     $addFields: {
                    //       doctor: "$doctors",
                    //     },
                    //   },
                    //   {
                    //     $project: {
                    //       doctor: 1,
                    //     },
                    //   },
                    //   {
                    //     $unwind: "$doctor",
                    //   },
                    //   {
                    //     $lookup: {
                    //       from: qualification,
                    //       localField: "doctor.qualification",
                    //       foreignField: "_id",
                    //       as: "doctor.qualification",
                    //     },
                    //   },
                    //   {
                    //     $lookup: {
                    //       from: specialization,
                    //       localField: "doctor.specialization",
                    //       foreignField: "_id",
                    //       as: "doctor.specialization",
                    //     },
                    //   },
                    //   {
                    //     $addFields: {
                    //       status: "$approved.approvalStatus",
                    //       experience: {
                    //         $function: {
                    //           body: function (experience: any) {
                    //             experience = new Date(experience);
                    //             let currentDate = new Date();
                    //             let age: number | string =
                    //               currentDate.getFullYear() - experience.getFullYear();
                    //             if (age > 0) {
                    //               age = `${age} years`;
                    //             } else {
                    //               age = `${age} months`;
                    //             }
                    //             return age;
                    //           },
                    //           lang: "js",
                    //           args: ["$doctor.overallExperience"],
                    //         },
                    //       },
                    //     },
                    //   },
                    // ],
                },
            },
            {
                $project: {
                    doctors: {
                        $setUnion: ["$approved", "$requestTo"],
                    },
                },
            },
        ]);
        return Promise.resolve(doctors);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsListInHospital_withApprovalStatus = getDoctorsListInHospital_withApprovalStatus;
const getHospitalsOfflineAndOnlineAppointments = (hospitalId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!hospitalId) {
            return Promise.reject("Give a Hospital's Id");
        }
        let [startDate, endDate] = (0, Utils_1.getRangeOfDates)(body.year, body.month);
        let offlineAppointments = Appointment_Model_1.default.aggregate([
            {
                $match: {
                    $and: [
                        {
                            hospital: new mongoose_1.default.Types.ObjectId(hospitalId),
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
                            hospital: new mongoose_1.default.Types.ObjectId(hospitalId),
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
exports.getHospitalsOfflineAndOnlineAppointments = getHospitalsOfflineAndOnlineAppointments;
const getPatientFromPhoneNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((0, Validation_Service_1.phoneNumberValidation)(phoneNumber)) {
            let patientId = yield Patient_Model_1.default.findOne({ phoneNumber }, "_id");
            if (patientId) {
                return Promise.resolve(patientId);
            }
            else {
                return Promise.reject(new Error("No patient exist with this phone number"));
            }
        }
        else {
            return Promise.reject(new Error("Invalid phone number"));
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getPatientFromPhoneNumber = getPatientFromPhoneNumber;
const getPatientsAppointmentsInThisHospital = (hospitalId, phoneNumber_patient, page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let formatAge = Utils_1.getAge;
        const limit = 10;
        const skip = parseInt(page) * limit;
        let patientId = yield (0, exports.getPatientFromPhoneNumber)(phoneNumber_patient);
        let appointmentsInThisHospital = yield Appointment_Model_1.default.aggregate([
            {
                $match: {
                    patient: new mongoose_1.default.Types.ObjectId(patientId),
                    hospital: new mongoose_1.default.Types.ObjectId(hospitalId),
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
                    "hospital.name": 1,
                    "hospital.address": 1,
                    "doctors.firstName": 1,
                    "doctors.lastName": 1,
                    "doctors._id": 1,
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
                $lookup: {
                    from: schemaNames_1.appointmentPayment,
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$appointmentId", "$$id"] },
                            },
                        },
                        {
                            $lookup: {
                                from: schemaNames_1.order,
                                localField: "orderId",
                                foreignField: "_id",
                                as: "order",
                            },
                        },
                        {
                            $unwind: "$order",
                        },
                        {
                            $project: {
                                order: 1,
                            },
                        },
                    ],
                    as: "paymentInfo",
                    // localField: "_id",
                    // foreignField: "appointmentId",
                    // as: "paymentInfo",
                },
            },
            {
                $unwind: "$paymentInfo",
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
exports.getPatientsAppointmentsInThisHospital = getPatientsAppointmentsInThisHospital;
const verifyPayment = (body, isHospital = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // payment Id aur payment signature
        let paymentId = `payment_id_gen_${Math.floor(100000 + Math.random() * 900000).toString()}`;
        let paymentSignature = `payment_sign_gen_${Math.floor(100000 + Math.random() * 900000).toString()}`;
        const appointmentBook = yield (0, Patient_Service_1.BookAppointment)(body.appointment, isHospital);
        const { orderId, orderReceipt } = body;
        const paymentObj = yield new AppointmentPayment_Model_1.default({
            paymentId,
            orderId: body.appointmentOrderId,
            paymentSignature,
            orderReceipt,
            appointmentId: appointmentBook._id,
        }).save();
        yield new CreditAmount_Model_1.default({
            orderId: body.appointmentOrderId,
            appointmentDetails: appointmentBook._id,
        }).save();
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.verifyPayment = verifyPayment;
const generateOrderId = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentOrderId, options, receiptNumber } = yield orderController.generateOrderId(body);
        let orderId = `order_${Math.floor(100000 + Math.random() * 900000).toString()}`;
        return Promise.resolve({
            appointmentOrderId,
            orderId: orderId,
            orderReceipt: `order_rcptid_${receiptNumber}`,
        });
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.generateOrderId = generateOrderId;
const doesHospitalExist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let hospitalExist = yield Hospital_Model_1.default.exists({ _id: id });
        return Promise.resolve(hospitalExist);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.doesHospitalExist = doesHospitalExist;
const getHolidayTimigsOfDoctorsInHospital = (hospitalId, doctorId, timings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const time = new Date(timings);
        let year = time.getFullYear(), month = time.getMonth(), currentDate = time.getDate();
        let startDate = new Date(year, month, currentDate);
        let endDate = new Date(year, month, currentDate + 1);
        let holidays = yield Holiday_Calendar_Model_1.default
            .find({
            hospitalId,
            doctorId: { $in: doctorId },
            date: { $gte: startDate, $lte: endDate },
            "delData.deleted": false,
        })
            .lean();
        return holidays;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHolidayTimigsOfDoctorsInHospital = getHolidayTimigsOfDoctorsInHospital;
const getDoctorsWorkingHourInHospital = (hospitalId, doctorId, day) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let workingHours = yield WorkingHours_Model_1.default.find({
            hospitalDetails: hospitalId,
            doctorDetails: { $in: doctorId },
            [day]: { $exists: true },
        });
        return Promise.resolve(workingHours);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsWorkingHourInHospital = getDoctorsWorkingHourInHospital;
const getDoctorsPrescriptionValidityInHospital = (hospitalId, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let prescription = yield Prescription_Model_1.default
            .find({
            hospitalId: hospitalId,
            doctorId: { $in: doctorId },
        })
            .lean();
        return Promise.resolve(prescription);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsPrescriptionValidityInHospital = getDoctorsPrescriptionValidityInHospital;
const doctorsInHospital = (hospitalId, timings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let day = new Date(timings).getDay();
        let WEEK_DAYS = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        day = WEEK_DAYS[day];
        let hospital = yield Hospital_Model_1.default
            .findOne({
            _id: hospitalId,
        })
            .populate({
            path: "doctors",
            populate: {
                path: "qualification specialization",
            },
        })
            .populate({
            path: "address",
            populate: {
                path: "city locality",
            },
        })
            .lean();
        let doctors = hospital.doctors.map((e) => e._id.toString());
        // Get holiday timings of doctors in hospital
        let holiday = yield (0, exports.getHolidayTimigsOfDoctorsInHospital)(hospital, doctors, timings);
        // Doctors working hours in hospital
        let workingHours = yield (0, exports.getDoctorsWorkingHourInHospital)(hospitalId, doctors, day);
        // Doctor's prescription for hospital
        let prescriptions = yield (0, exports.getDoctorsPrescriptionValidityInHospital)(hospitalId, doctors);
        let newData = hospital.doctors.map((e) => {
            let exist = holiday.find((elem) => elem.doctorId.toString() === e._id.toString(0));
            let WH = workingHours.filter((elem) => elem.doctorDetails.toString() === e._id.toString());
            let PRES = prescriptions.find((elem) => elem.doctorId.toString() === e._id.toString());
            let obj = Object.assign(Object.assign({}, e), { workingHours: WH, prescription: PRES, available: true, scheduleAvailable: true });
            if (exist) {
                obj = Object.assign(Object.assign({}, e), { available: false, workingHours: WH, prescription: PRES, scheduleAvailable: true });
            }
            if (!WH.length) {
                obj = Object.assign(Object.assign({}, obj), { available: false, scheduleAvailable: false, prescription: PRES });
            }
            return obj;
        });
        hospital.doctors = newData;
        return Promise.resolve(hospital);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.doctorsInHospital = doctorsInHospital;
const getHolidayTimigsOfHospitalsInDoctor = (doctorId, hospitalId, timings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const time = new Date(timings);
        let year = time.getFullYear(), month = time.getMonth(), currentDate = time.getDate();
        let startDate = new Date(year, month, currentDate);
        let endDate = new Date(year, month, currentDate + 1);
        let holidays = yield Holiday_Calendar_Model_1.default
            .find({
            doctorId,
            hospitalId: { $in: hospitalId },
            date: { $gte: startDate, $lte: endDate },
            "delData.deleted": false,
        })
            .lean();
        console.log("ljhgfcghvdssds", holidays);
        return holidays;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHolidayTimigsOfHospitalsInDoctor = getHolidayTimigsOfHospitalsInDoctor;
const getHospitalsWorkingHourInDoctor = (doctorId, hospitalId, day) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let workingHours = yield WorkingHours_Model_1.default
            .find({
            hospitalDetails: { $in: hospitalId },
            doctorDetails: doctorId,
            [day]: { $exists: true },
        })
            .lean();
        return Promise.resolve(workingHours);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHospitalsWorkingHourInDoctor = getHospitalsWorkingHourInDoctor;
const getHospitalsPrescriptionValidityInDoctor = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("doctorsd", doctorId);
        console.log("hsiusihjbsss", hospitalId);
        let prescription = yield Prescription_Model_1.default
            .find({
            hospitalId: { $in: hospitalId },
            doctorId: doctorId,
        })
            .lean();
        return Promise.resolve(prescription);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHospitalsPrescriptionValidityInDoctor = getHospitalsPrescriptionValidityInDoctor;
const hospitalsInDoctor = (doctorId, timings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let day = new Date(timings).getDay();
        let WEEK_DAYS = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        day = WEEK_DAYS[day];
        let doctors = yield Doctors_Model_1.default
            .findOne({ _id: doctorId })
            .populate({
            path: "specialization qualification",
        })
            .populate({
            path: "hospitalDetails.hospital",
            populate: {
                path: "address",
                populate: {
                    path: "city locality",
                },
            },
        })
            .lean();
        // .populate({
        //   path: "hospitalDetails.hospital.address",
        //   // populate: {
        //   //   path: "hospitalDetails.hospital.address.city hospitalDetails.hospital.address.locality",
        //   // },
        // });
        let hospitals = doctors.hospitalDetails.map((e) => { var _a, _b; return (_b = (_a = e === null || e === void 0 ? void 0 : e.hospital) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(); });
        // Get holiday timings of doctors in hospital
        let holiday = yield (0, exports.getHolidayTimigsOfHospitalsInDoctor)(doctors._id, hospitals, timings);
        // // Doctors working hours in hospital
        let workingHours = yield (0, exports.getHospitalsWorkingHourInDoctor)(doctors._id, hospitals, day);
        // // Doctor's prescription for hospital
        let prescriptions = yield (0, exports.getHospitalsPrescriptionValidityInDoctor)(doctors._id, hospitals);
        let newData = doctors.hospitalDetails.map((e) => {
            let exist = holiday.find((elem) => { var _a; return elem.hospitalId.toString() === ((_a = e === null || e === void 0 ? void 0 : e.hospital) === null || _a === void 0 ? void 0 : _a._id.toString(0)); });
            let WH = workingHours.filter((elem) => { var _a; return elem.hospitalDetails.toString() === ((_a = e === null || e === void 0 ? void 0 : e.hospital) === null || _a === void 0 ? void 0 : _a._id.toString()); });
            let PRES = prescriptions.find((elem) => { var _a; return elem.hospitalId.toString() === ((_a = e === null || e === void 0 ? void 0 : e.hospital) === null || _a === void 0 ? void 0 : _a._id.toString()); });
            let obj = Object.assign(Object.assign({}, e), { workingHours: WH, prescription: PRES, available: true, scheduleAvailable: true });
            if (exist) {
                obj = Object.assign(Object.assign({}, e), { available: false, workingHours: WH, prescription: PRES, scheduleAvailable: true });
            }
            if (!WH) {
                obj = Object.assign(Object.assign({}, obj), { available: false, scheduleAvailable: false, prescription: PRES });
            }
            return obj;
        });
        doctors.hospitalDetails = newData;
        return Promise.resolve(doctors);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.hospitalsInDoctor = hospitalsInDoctor;
const getHospitalById = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let hospitalData = yield Hospital_Model_1.default
            .find({ _id: hospitalId })
            .populate({
            path: "address",
            populate: {
                path: "city state locality",
            },
        })
            .populate({
            path: "anemity services",
        });
        return Promise.resolve(hospitalData);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHospitalById = getHospitalById;
const getCitiesWhereHospitalsExist = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield Hospital_Model_1.default
            .find({})
            .populate({
            path: "address",
            select: "city",
            populate: {
                path: "city",
            },
        })
            .select("address")
            .lean();
        let cities = [];
        data.map((e) => {
            var _a, _b;
            let city = e === null || e === void 0 ? void 0 : e.address;
            let exist = cities.find((elem) => { var _a; return (elem === null || elem === void 0 ? void 0 : elem._id) === ((_a = city === null || city === void 0 ? void 0 : city.city) === null || _a === void 0 ? void 0 : _a._id); });
            if (!exist) {
                cities.push({
                    _id: (_a = city === null || city === void 0 ? void 0 : city.city) === null || _a === void 0 ? void 0 : _a._id,
                    name: (_b = city === null || city === void 0 ? void 0 : city.city) === null || _b === void 0 ? void 0 : _b.name,
                });
            }
        });
        return cities;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getCitiesWhereHospitalsExist = getCitiesWhereHospitalsExist;
const changeAppointmentStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!Object.values(Helpers_1.AppointmentStatus).includes(status)) {
            const error = new Error("Invalid status value");
            return Promise.reject(error);
        }
        yield Appointment_Model_1.default.findOneAndUpdate({ _id: id, }, { $set: { appointmentStatus: status } });
        return true;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.changeAppointmentStatus = changeAppointmentStatus;
const addHolidayForHospital = (id, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield Hospital_Model_1.default.findOneAndUpdate({ _id: id }, { $push: { holiday: date } }, { upsert: true, new: true });
        return updatedRecord;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.addHolidayForHospital = addHolidayForHospital;
const getHolidayForHospital = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield Hospital_Model_1.default.findOne({ _id: id }, "holiday").lean();
        const holidays = record === null || record === void 0 ? void 0 : record.holiday;
        const isCloseTomorrow = holidays.some((date) => (0, Utils_1.getDateDifferenceFromCurrentDate)(date) === 1);
        return Object.assign(Object.assign({}, record), { isCloseTomorrow });
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHolidayForHospital = getHolidayForHospital;
const updateHospitalsLastLogin = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Hospital_Model_1.default.findOneAndUpdate({ _id: hospitalId }, { $set: { lastLogin: new Date(), status: Helpers_1.UserStatus.ACTIVE } });
});
exports.updateHospitalsLastLogin = updateHospitalsLastLogin;
const checkIfDoctorHasLoggedInInThePastGivenDays = (hospitals, numberOfDays) => {
    const hospitalsThatHaveNotLoggedInThePastWeek = hospitals.filter((hospital) => {
        const dateDifference = (0, Utils_1.getDateDifferenceFromCurrentDate)(hospital.lastLogin);
        if (dateDifference < numberOfDays) {
            return true;
        }
    });
    return hospitalsThatHaveNotLoggedInThePastWeek;
};
const checkIfHospitalHasLoggedInThePastWeek = (hospitals) => {
    return checkIfDoctorHasLoggedInInThePastGivenDays(hospitals, -7);
};
exports.checkIfHospitalHasLoggedInThePastWeek = checkIfHospitalHasLoggedInThePastWeek;
const checkIfHospitalHasLoggedInInThePastMonth = (hospitals) => {
    return checkIfDoctorHasLoggedInInThePastGivenDays(hospitals, -37);
};
exports.checkIfHospitalHasLoggedInInThePastMonth = checkIfHospitalHasLoggedInInThePastMonth;
const markHospitalsAccountAsOnHold = (hospitals) => __awaiter(void 0, void 0, void 0, function* () {
    yield Hospital_Model_1.default.updateMany({ _id: { $in: hospitals.map((hospital) => hospital.id) } }, { $set: { status: Helpers_1.UserStatus.ONHOLD } });
});
exports.markHospitalsAccountAsOnHold = markHospitalsAccountAsOnHold;
const markHospitalsAccountAsInactive = (hospitals) => __awaiter(void 0, void 0, void 0, function* () {
    yield Hospital_Model_1.default.updateMany({ _id: { $in: hospitals.map((hospital) => hospital.id) } }, { $set: { status: Helpers_1.UserStatus.INACTIVE } });
});
exports.markHospitalsAccountAsInactive = markHospitalsAccountAsInactive;
