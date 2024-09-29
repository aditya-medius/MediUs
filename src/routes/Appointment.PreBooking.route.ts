import express, { NextFunction, Request, Response } from "express";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticatePatient } from "../authentication/Patient.auth";
import { AppointmentPreBooking } from "../Controllers";
import { AppointmentPreBookingService } from "../Services/Appointment Pre Booking";
const appointmentPreBookingRouter = express.Router();


const appointmetPreBookingUtil = AppointmentPreBookingService.Init()
const appointmentPreBookingService = AppointmentPreBookingService.Init(appointmetPreBookingUtil)
const appointmentPreBookingController = AppointmentPreBooking.Init(appointmentPreBookingService);

appointmentPreBookingRouter.get("/details/:doctorId", oneOf(authenticateHospital, authenticatePatient), appointmentPreBookingController.details)


export default appointmentPreBookingRouter