import express, { Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticatePatient } from "../authentication/Patient.auth";
import * as hospitalController from "../Controllers/Hospital.Controller";
import {
  createWorkingHours,
  createOpeningHours,
} from "../Controllers/WorkingHours.Controller";
import { oneOf } from "../Services/middlewareHelper";

const hospitalRouter = express.Router();

hospitalRouter.get(
  "/",
  // oneOf(authenticateHospital),
  hospitalController.getAllHospitalsList
);
hospitalRouter.post("/login", hospitalController.login);
hospitalRouter.post("/loginWithPassword", hospitalController.loginWithPassword);

hospitalRouter.get(
  "/myHospital",
  authenticateHospital,
  hospitalController.myHospital
);

// hospitalRouter.get("/", authenticateHospital, hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);
hospitalRouter.post(
  "/deleteHospital",
  oneOf(authenticateHospital),
  hospitalController.deleteHospital
);
hospitalRouter.post(
  "/updateHospital",
  oneOf(authenticateHospital),
  hospitalController.updateHospital
);

hospitalRouter.post(
  "/anemity",
  oneOf(authenticateHospital),
  hospitalController.createHospitalAnemity
);
hospitalRouter.get("/getAnemities", hospitalController.getAnemities);
hospitalRouter.get("/getServices", hospitalController.getServices);
// hospitalRouter.post("/speciality",oneOf(authenticateHospital),hospitalController.addHospitalSpeciality);

hospitalRouter.post(
  "/findHospitalBySpecialityOrBodyPart/:term",
  hospitalController.searchHospital
);

//ADD DOCTOR TO THE HOSPITAL
hospitalRouter.post(
  "/removeDoctor",
  oneOf(authenticateHospital),
  hospitalController.removeDoctor
);

//View Appointments

hospitalRouter.get(
  "/viewAppointment/:page",
  oneOf(authenticateHospital),
  hospitalController.viewAppointment
);

// Get hospital by id
hospitalRouter.get(
  "/getHospitalById/:id",
  oneOf(authenticatePatient, authenticateDoctor, authenticateHospital),
  hospitalController.getHospitalById
);

// Hospital opening hours
hospitalRouter.post("/createOpeningHours", createOpeningHours);

export default hospitalRouter;
