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
exports.getHospitalsOfflineAndOnlineAppointments = exports.getDoctorsListInHospital_withApprovalStatus = exports.getHospitalsSpecilization_AccordingToDoctor = exports.getHospitalToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
const mongoose_1 = __importDefault(require("mongoose"));
const Appointment_Model_1 = __importDefault(require("../../Models/Appointment.Model"));
const Utils_1 = require("../Utils");
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
                            $addFields: {
                                status: "$approved.approvalStatus",
                            },
                        },
                        {
                            $project: {
                                approved: 0,
                            },
                        },
                    ],
                    doctors: [
                        {
                            $lookup: {
                                from: "doctors",
                                localField: "doctors",
                                foreignField: "_id",
                                as: "doctors",
                            },
                        },
                        {
                            $addFields: {
                                doctor: "$doctors",
                            },
                        },
                        {
                            $project: {
                                doctor: 1,
                            },
                        },
                        {
                            $unwind: "$doctor",
                        },
                    ],
                },
            },
            {
                $project: {
                    doctors: {
                        $setUnion: ["$approved", "$doctors"],
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
