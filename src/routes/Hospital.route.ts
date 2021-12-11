import express, { Request, Response } from "express";
import * as hospitalController from "../Controllers/Hospital.Controller";
const hospitalRouter = express.Router();

hospitalRouter.get("/", hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);
hospitalRouter.post("/deleteHospital", hospitalController.deleteHospital);

hospitalRouter.post("/anemity",hospitalController.createHospitalAnemity);
hospitalRouter.post("/speciality",hospitalController.addHospitalSpeciality);

export default hospitalRouter;
