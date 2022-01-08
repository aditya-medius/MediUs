import express, { Request, Response } from "express";
import { authenticateHospital } from "../authentication/Hospital.auth";
import * as hospitalController from "../Controllers/Hospital.Controller";
import { oneOf } from "../Services/middlewareHelper";

const hospitalRouter = express.Router();

hospitalRouter.get(
  "/",
  oneOf(authenticateHospital),
  hospitalController.getAllHospitalsList
);
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

export default hospitalRouter;
