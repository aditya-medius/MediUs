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
exports.getDoctorPrescriptionInHospital = exports.getPrescriptionValidityAndFeesOfDoctorInHospital = exports.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod = exports.setPrescriptionValidity = void 0;
const Appointment_Model_1 = __importDefault(require("../Models/Appointment.Model"));
const Prescription_Validity_Model_1 = __importDefault(require("../Models/Prescription-Validity.Model"));
const response_1 = require("../Services/response");
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const doctorService = __importStar(require("../Services/Doctor/Doctor.Service"));
const setPrescriptionValidity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId = req.currentDoctor ? req.currentDoctor : req.body.doctorId, validateTill, hospitalId, } = req.body;
        let prescription = yield new Prescription_Validity_Model_1.default({
            doctorId,
            hospitalId,
            validateTill,
        }).save();
        return (0, response_1.successResponse)(prescription, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setPrescriptionValidity = setPrescriptionValidity;
const checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId, patientId, hospitalId, subPatientId } = body;
        const PV = yield Prescription_Validity_Model_1.default.findOne({
            doctorId,
        });
        let appointment = (yield Appointment_Model_1.default.aggregate([
            {
                $match: {
                    patient: new mongoose_1.default.Types.ObjectId(patientId),
                    doctors: new mongoose_1.default.Types.ObjectId(doctorId),
                    hospital: new mongoose_1.default.Types.ObjectId(hospitalId),
                    subPatient: new mongoose_1.default.Types.ObjectId(subPatientId),
                },
            },
            {
                $sort: {
                    "time.date": -1,
                },
            },
        ]))[0];
        if (PV) {
            // const date = new Date(appointment.time.date).getDate();
            if (appointment) {
                const date = (0, moment_1.default)(appointment.time.date, "DD.MM.YYY");
                const currentDate = (0, moment_1.default)(new Date(), "DD.MM.YYYY");
                let difference = currentDate.diff(date, "days");
                if (difference > PV.validateTill) {
                    /* Fresh appointment */
                    return Promise.resolve(false);
                }
                else {
                    /* Follow up appointment */
                    return Promise.resolve(true);
                }
            }
            else {
                /* Fresh appointment */
                return Promise.resolve(false);
            }
        }
        else {
            return Promise.resolve(true);
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod = checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod;
const getPrescriptionValidityAndFeesOfDoctorInHospital = (hospitalId, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield Promise.all([
            (0, exports.getDoctorPrescriptionInHospital)(hospitalId, doctorId),
            doctorService.getDoctorFeeInHospital(doctorId, hospitalId),
        ]);
        return Promise.resolve(data);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getPrescriptionValidityAndFeesOfDoctorInHospital = getPrescriptionValidityAndFeesOfDoctorInHospital;
const getDoctorPrescriptionInHospital = (hospitalId, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let prescription = yield Prescription_Validity_Model_1.default.find({ doctorId, hospitalId }, "validateTill");
        return Promise.resolve({ prescription });
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorPrescriptionInHospital = getDoctorPrescriptionInHospital;
