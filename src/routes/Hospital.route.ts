import express, { Request, Response } from "express";
import { authenticateHospital } from "../authentication/Hospital.auth";
import * as hospitalController from "../Controllers/Hospital.Controller";
const hospitalRouter = express.Router();

hospitalRouter.get("/", authenticateHospital, hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);
hospitalRouter.post("/deleteHospital",authenticateHospital, hospitalController.deleteHospital);
hospitalRouter.post("/updateHospital",authenticateHospital, hospitalController.updateHospital);

hospitalRouter.post("/anemity",authenticateHospital,hospitalController.createHospitalAnemity);
// hospitalRouter.post("/speciality",authenticateHospital,hospitalController.addHospitalSpeciality);

hospitalRouter.post("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);

export default hospitalRouter;
