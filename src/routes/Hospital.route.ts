import express, { Request, Response } from "express";
import * as hospitalController from "../Controllers/Hospital.Controller";
const hospitalRouter = express.Router();

hospitalRouter.get("/", hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);

//demo routes for city anemity specialities address etc..

hospitalRouter.post("/anemity",hospitalController.createHospitalAnemity);
hospitalRouter.post("/speciality",hospitalController.addHospitalSpeciality);
hospitalRouter.post("/city",hospitalController.addCity);
hospitalRouter.post("/state",hospitalController.addState);
hospitalRouter.post("/locality",hospitalController.addLocality);
hospitalRouter.post("/country",hospitalController.addCountry);
hospitalRouter.post("/address",hospitalController.addAddress);

export default hospitalRouter;
