"use strict";
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
exports.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod = exports.setPrescriptionValidity = void 0;
const Appointment_Model_1 = __importDefault(require("../Models/Appointment.Model"));
const Prescription_Validity_Model_1 = __importDefault(require("../Models/Prescription-Validity.Model"));
const response_1 = require("../Services/response");
const moment_1 = __importDefault(require("moment"));
const setPrescriptionValidity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId, validateTill } = req.body;
        let prescription = yield new Prescription_Validity_Model_1.default({
            doctorId,
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
        let { doctorId, patientId, hospitalId } = body;
        const PV = yield Prescription_Validity_Model_1.default.findOne({
            doctorId,
        });
        const appointment = (yield Appointment_Model_1.default.aggregate([
            {
                $match: {
                    patient: patientId,
                    doctors: doctorId,
                    hospital: hospitalId,
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
            const date = (0, moment_1.default)(new Date(appointment.time.date).getDate(), "DD.MM.YYYY");
            const currentDate = (0, moment_1.default)(new Date(), "DD.MM.YYYY");
            let difference = date.diff(currentDate, "days");
            if (difference > PV.validateTill) {
                return Promise.reject(false);
            }
            else {
                return Promise.resolve(true);
            }
            return Promise.resolve(PV.validateTill);
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
