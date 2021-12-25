import express, { Request, Response } from "express";
import { authenticatePatient } from "../authentication/Patient.auth";
import * as patientController from "../Controllers/Patient.Controller";
const patientRouter = express.Router();

patientRouter.post("/login", patientController.patientLogin);
patientRouter.post("/", patientController.createPatient);
patientRouter.get(
  "/",
  authenticatePatient,
  patientController.getAllPatientsList
);
patientRouter.post(
  "/getPatientById/:id",
  authenticatePatient,
  patientController.getPatientById
);
patientRouter.post(
  "/updateProfile",
  authenticatePatient,
  patientController.updatePatientProfile
);
patientRouter.post(
  "/deleteProfile",
  authenticatePatient,
  patientController.deleteProfile
);
patientRouter.post(
  "/BookAppointment",
  authenticatePatient,
  patientController.BookAppointment
);
patientRouter.post(
  "/CancelAppointment",
  authenticatePatient,
  patientController.CancelAppointment
);
patientRouter.post(
  "/doneAppointment",
  authenticatePatient,
  patientController.doneAppointment
);
patientRouter.post(
  "/getDoctorByDay",
  authenticatePatient,
  patientController.getDoctorByDay
);

patientRouter.post(
  "/generateOrderId",
  authenticatePatient,
  patientController.generateOrderId
);
patientRouter.post(
  "/verifyPayment",
  authenticatePatient,
  patientController.verifyPayment
);
export default patientRouter;
