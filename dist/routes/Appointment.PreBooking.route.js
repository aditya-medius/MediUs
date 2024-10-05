"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewareHelper_1 = require("../Services/middlewareHelper");
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const Patient_auth_1 = require("../authentication/Patient.auth");
const Controllers_1 = require("../Controllers");
const Appointment_Pre_Booking_1 = require("../Services/Appointment Pre Booking");
const appointmentPreBookingRouter = express_1.default.Router();
const appointmentPreBookingCommonService = Appointment_Pre_Booking_1.AppointmentPreBookingCommonService.Init();
const appointmentPreBookingForPatientService = Appointment_Pre_Booking_1.AppointmentPreBookingForPatientService.Init(appointmentPreBookingCommonService);
const appointmentPreBookingForHospitalService = Appointment_Pre_Booking_1.AppointmentPreBookingForHospitalService.Init(appointmentPreBookingCommonService);
const appointmentPreBookingService = Appointment_Pre_Booking_1.AppointmentPreBookingService.Init(appointmentPreBookingForPatientService, appointmentPreBookingForHospitalService);
// const appointmentPreBookingService = AppointmentPreBookingService.Init()
const appointmentPreBookingController = Controllers_1.AppointmentPreBooking.Init(appointmentPreBookingService);
appointmentPreBookingRouter.get("/hospital/details/:hospitalId", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), appointmentPreBookingController.hospitalDetails);
appointmentPreBookingRouter.get("/details/:doctorId", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), appointmentPreBookingController.details);
exports.default = appointmentPreBookingRouter;
