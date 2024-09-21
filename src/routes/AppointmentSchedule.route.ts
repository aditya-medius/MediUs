import express, { NextFunction, Request, Response } from "express";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod } from "../Controllers/Prescription-Validity.Controller";
import { AppointmentType } from "../Services/Helpers";
import { errorResponse } from "../Services/response";
import * as hospitalController from "../Controllers/Hospital.Controller";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import { authenticatePatient } from "../authentication/Patient.auth";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import { authenticateAdmin } from "../authentication/Admin.auth";

const appointmentScheduleRouter = express.Router();

appointmentScheduleRouter.get("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);

appointmentScheduleRouter.put("/doctors/in/hospital", hospitalController.doctorsInHospitalWithTimings);

appointmentScheduleRouter.get("/getHospitalDetails/:id", oneOf(authenticateHospital), hospitalController.getHospitalDetails);

appointmentScheduleRouter.put("/getPatientsAppointmentsInThisHospital/:page", oneOf(authenticateHospital), hospitalController.getPatientsAppointmentsInThisHospital);

appointmentScheduleRouter.get("/searchHospitalByPhoneNumber/:term", oneOf(authenticateHospital, authenticateDoctor, authenticatePatient), hospitalController.searchHospitalByPhoneNumber);

appointmentScheduleRouter.post("/getDoctorsOfflineAndOnlineAppointments", oneOf(authenticateHospital), hospitalController.getDoctorsOfflineAndOnlineAppointments);

appointmentScheduleRouter.post("/getAppointmentByDate", oneOf(authenticateHospital), hospitalController.getAppointmentByDate);

appointmentScheduleRouter.get("/getDoctorsInHospital", oneOf(authenticateHospital), hospitalController.getDoctorsInHospital);

appointmentScheduleRouter.put("/getHospitalById/:id", oneOf(authenticatePatient, authenticateDoctor, authenticateHospital, authenticateSuvedha, authenticateAdmin), hospitalController.getHospitalById);

appointmentScheduleRouter.get("/viewAppointment/:page", oneOf(authenticateHospital), hospitalController.viewAppointment);

appointmentScheduleRouter.get("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);



export default appointmentScheduleRouter;
