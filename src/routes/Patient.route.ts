import express, { Request, Response } from "express";
import { authenticatePatient } from "../authentication/Patient.auth";
import * as patientController from "../Controllers/Patient.Controller";
import * as paymentController from "../Controllers/AppointmentPayment.Controller";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import * as subPatientController from "../Controllers/SubPatient.Controller";
import { patient, subPatient } from "../Services/schemaNames";
const patientRouter = express.Router();

patientRouter.post("/login", patientController.patientLogin);
patientRouter.post("/", patientController.createPatient);
patientRouter.get(
  "/",
  oneOf(authenticatePatient),
  patientController.getAllPatientsList
);
patientRouter.post(
  "/getPatientById/:id",
  oneOf(authenticatePatient),
  patientController.getPatientById
);
patientRouter.post(
  "/updateProfile",
  oneOf(authenticatePatient),
  patientController.updatePatientProfile
);
patientRouter.post(
  "/deleteProfile",
  oneOf(authenticatePatient),
  patientController.deleteProfile
);
patientRouter.post(
  "/BookAppointment",
  oneOf(authenticatePatient),
  patientController.BookAppointment
);
patientRouter.post(
  "/CancelAppointment",
  oneOf(authenticatePatient),
  patientController.CancelAppointment
);
patientRouter.post(
  "/doneAppointment",
  oneOf(authenticatePatient),
  patientController.doneAppointment
);
patientRouter.post(
  "/getDoctorByDay",
  oneOf(authenticatePatient),
  patientController.getDoctorByDay
);

patientRouter.post(
  "/generateOrderId",
  oneOf(authenticatePatient),
  paymentController.generateOrderId
);
patientRouter.post(
  "/verifyPayment",
  oneOf(authenticatePatient),
  paymentController.verifyPayment
);
patientRouter.get(
  "/viewAppointment/:page",
  oneOf(authenticatePatient),
  patientController.ViewAppointment
);

// Get all the entities of filter
patientRouter.get(
  "/getSpecialityBodyPartAndDisease",
  patientController.getSpecialityBodyPartAndDisease
);

// Get hospitals by city
patientRouter.get(
  "/getHospitalsByCity",
  oneOf(authenticatePatient),
  patientController.getHospitalsByCity
);

// Get doctors by city
patientRouter.get(
  "/getDoctorsByCity",
  oneOf(authenticatePatient),
  patientController.getDoctorsByCity
);

// Sub Patient
patientRouter.post(
  "/addSubPatient",
  oneOf(authenticatePatient),
  subPatientController.addSubPatient
);

patientRouter.get(
  "/getSubPatientList",
  oneOf(authenticatePatient),
  subPatientController.getSubPatientList
);

patientRouter.put(
  "/deleteSubPatient/:id",
  oneOf(authenticatePatient),
  subPatientController.deleteSubPatient
);

patientRouter.get(
  "/getSubPatientById/:id",
  oneOf(authenticatePatient),
  subPatientController.getSubPatientById
);

patientRouter.put(
  "/updateSubPatient/:id",
  oneOf(authenticatePatient),
  subPatientController.updateSubPatient
);

export default patientRouter;
