import express, { Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticatePatient } from "../authentication/Patient.auth";
import { oneOf } from "../Services/middlewareHelper";
import * as feedbackController from "../Controllers/Feedback.Controller";
import { feedback } from "../Services/schemaNames";

const feedbackRouter = express.Router();

feedbackRouter.post(
  "/submitfeedback",
  oneOf(authenticateDoctor, authenticateHospital, authenticatePatient),
  feedbackController.submitFeedback
);

feedbackRouter.get(
  "/getAllFeedbacks",
  oneOf(authenticatePatient, authenticateHospital, authenticateDoctor),
  feedbackController.getAllFeedbacks
);
export default feedbackRouter;
