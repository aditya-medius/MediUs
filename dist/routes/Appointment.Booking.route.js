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
const express_1 = __importDefault(require("express"));
const middlewareHelper_1 = require("../Services/middlewareHelper");
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const Prescription_Validity_Controller_1 = require("../Controllers/Prescription-Validity.Controller");
const Helpers_1 = require("../Services/Helpers");
const response_1 = require("../Services/response");
const Patient_auth_1 = require("../authentication/Patient.auth");
const Suvedha_auth_1 = require("../authentication/Suvedha.auth");
const Controllers_1 = require("../Controllers");
const appointmentBookingRouter = express_1.default.Router();
const appointmentBookingController = Controllers_1.AppointmentBookingController.Init();
appointmentBookingRouter.post("/verifyPayment", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorId = req.body.doctors, patientId = req.body.patient, hospitalId = req.body.hospital, subPatientId = req.body.subPatient;
        let valid = yield (0, Prescription_Validity_Controller_1.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod)({
            doctorId,
            patientId,
            hospitalId,
            subPatientId,
        });
        req.body["appointmentType"] = valid ? Helpers_1.AppointmentType.FOLLOW_UP : Helpers_1.AppointmentType.FRESH;
        if (req.currentHospital) {
            req.body.appointment["appointmentBookedBy"] = "Hospital";
        }
        req.body.appointment["appointmentType"] = req.body["appointmentType"];
        next();
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}), appointmentBookingController.verifyPayment);
appointmentBookingRouter.post("/generateOrderId", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital, Suvedha_auth_1.authenticateSuvedha), appointmentBookingController.generateOrderId);
exports.default = appointmentBookingRouter;
