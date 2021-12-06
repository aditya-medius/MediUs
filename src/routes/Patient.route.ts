import express, { Request, Response } from "express";
import { authenticatePatient } from "../authentication/Patient.auth";
import * as patientController from "../Controllers/Patient.Controller";
const patientRouter = express.Router();

patientRouter.post("/login", patientController.patientLogin);
patientRouter.post("/", patientController.createPatient);
patientRouter.get("/", authenticatePatient, patientController.getAllPatientsList);
patientRouter.post(
  "/getPatientById/:id",
  authenticatePatient,
  patientController.getPatientById
);
export default patientRouter;
