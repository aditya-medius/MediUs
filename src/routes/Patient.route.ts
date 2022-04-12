import express, { Request, Response } from "express";
import { authenticatePatient } from "../authentication/Patient.auth";
import * as patientController from "../Controllers/Patient.Controller";
import * as paymentController from "../Controllers/AppointmentPayment.Controller";
import multer from "multer";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import * as subPatientController from "../Controllers/SubPatient.Controller";
import { patient, subPatient } from "../Services/schemaNames";
import { authenticateHospital } from "../authentication/Hospital.auth";
const patientRouter = express.Router();
const upload = multer({ dest: "./src/uploads" });
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
  oneOf(authenticatePatient, authenticateHospital),
  patientController.BookAppointment
);
patientRouter.post(
  "/rescheduleAppointment",
  oneOf(authenticatePatient),
  patientController.rescheduleAppointment
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
//upload prescription
patientRouter.post(
  "/uploadPrescription",
  upload.single("prescription"),
  authenticatePatient,
  patientController.uploadPrescription
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

// Check kro k doctor available hai uss din
patientRouter.post(
  "/checkDoctorAvailability",
  oneOf(authenticateDoctor, authenticatePatient),
  patientController.checkDoctorAvailability
);

// Search patient
patientRouter.get(
  "/searchPatientByPhoneNumberOrEmail/:term",
  oneOf(authenticateDoctor, authenticatePatient, authenticateHospital),
  patientController.searchPatientByPhoneNumberOrEmail
);

patientRouter.put(
  "/checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod",
  oneOf(authenticatePatient),
  patientController.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod
);
export default patientRouter;
