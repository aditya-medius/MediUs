import express, { Request, Response } from "express";
import * as hospitalController from "../Controllers/Hospital.Controller";
const hospitalRouter = express.Router();

hospitalRouter.get("/", hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);
hospitalRouter.post("/anemity",hospitalController.createHospitalAnemity);

export default hospitalRouter;
