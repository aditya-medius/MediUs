import express, { Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
// import * as doctorController from "../Controllers/Doctor.Controller";
import * as doctorController from "../Controllers/Doctor.Controller";
const doctorRouter = express.Router();

doctorRouter.post("/login", doctorController.doctorLogin);
doctorRouter.post("/", doctorController.createDoctor);
doctorRouter.get("/", authenticateDoctor, doctorController.getAllDoctorsList);
doctorRouter.post(
  "/getDoctorById/:id",
  authenticateDoctor,
  doctorController.getDoctorById
);
doctorRouter.post(
  "/updateProfile",
  authenticateDoctor,
  doctorController.updateDoctorProfile
);
doctorRouter.post(
  "/deleteProfile",
  authenticateDoctor,
  doctorController.deleteProfile
);
export default doctorRouter;