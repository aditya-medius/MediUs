import express, { NextFunction, Request, Response } from "express";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticatePatient } from "../authentication/Patient.auth";
import { AppointmentPreBooking } from "../Controllers";
import { AppointmentPreBookingCommonService, AppointmentPreBookingForHospitalService, AppointmentPreBookingForPatientService, AppointmentPreBookingService } from "../Services/Appointment Pre Booking";
const appointmentPreBookingRouter = express.Router();


const appointmentPreBookingCommonService = AppointmentPreBookingCommonService.Init()
const appointmentPreBookingForPatientService = AppointmentPreBookingForPatientService.Init(appointmentPreBookingCommonService)
const appointmentPreBookingForHospitalService = AppointmentPreBookingForHospitalService.Init(appointmentPreBookingCommonService)
const appointmentPreBookingService = AppointmentPreBookingService.Init(appointmentPreBookingForPatientService, appointmentPreBookingForHospitalService)
// const appointmentPreBookingService = AppointmentPreBookingService.Init()

const appointmentPreBookingController = AppointmentPreBooking.Init(appointmentPreBookingService);

appointmentPreBookingRouter.get("/hospital/details/:hospitalId", oneOf(authenticateHospital, authenticatePatient), appointmentPreBookingController.hospitalDetails)

appointmentPreBookingRouter.get("/details/:doctorId", oneOf(authenticateHospital, authenticatePatient), appointmentPreBookingController.details)



export default appointmentPreBookingRouter