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
const appointmetPreBookingUtil = Appointment_Pre_Booking_1.AppointmentPreBookingService.Init();
const appointmentPreBookingService = Appointment_Pre_Booking_1.AppointmentPreBookingService.Init(appointmetPreBookingUtil);
const appointmentPreBookingController = Controllers_1.AppointmentPreBooking.Init(appointmentPreBookingService);
appointmentPreBookingRouter.get("/getDetails/:doctorId", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), appointmentPreBookingController.details);
exports.default = appointmentPreBookingRouter;
