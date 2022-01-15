import express, { Request, Response } from "express";
import { authenticatePatient } from "../authentication/Patient.auth";
import * as patientController from "../Controllers/Patient.Controller";
import * as paymentController from "../Controllers/AppointmentPayment.Controller";
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
  paymentController.generateOrderId
);
patientRouter.post(
  "/verifyPayment",
  authenticatePatient,
  paymentController.verifyPayment
);
patientRouter.get(
  "/viewAppointment/:page",
  authenticatePatient,
  patientController.ViewAppointment
);

// Get all the entities of filter
patientRouter.get(
  "/getSpecialityBodyPartAndDisease",
  authenticatePatient,
  patientController.getSpecialityBodyPartAndDisease
);

// Get hospitals by city
patientRouter.get(
  "/getHospitalsByCity",
  authenticatePatient,
  patientController.getHospitalsByCity
);

// Get doctors by city
patientRouter.get(
  "/getDoctorsByCity",
  authenticatePatient,
  patientController.getDoctorsByCity
);
//upload prescription
patientRouter.post(
  "/uploadPrescription",
   authenticatePatient,
  patientController.uploadPrescription
)
export default patientRouter;
