import express, { Request, Response } from "express";
import { authenticateHospital } from "../authentication/Hospital.auth";
import * as hospitalController from "../Controllers/Hospital.Controller";
const hospitalRouter = express.Router();

hospitalRouter.post("/login",hospitalController.login);

hospitalRouter.get("/myHospital",authenticateHospital,hospitalController.myHospital);

hospitalRouter.get("/", authenticateHospital, hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);
hospitalRouter.post("/deleteHospital",authenticateHospital, hospitalController.deleteHospital);
hospitalRouter.post("/updateHospital",authenticateHospital, hospitalController.updateHospital);

hospitalRouter.post("/anemity",authenticateHospital,hospitalController.createHospitalAnemity);
// hospitalRouter.post("/speciality",authenticateHospital,hospitalController.addHospitalSpeciality);

hospitalRouter.post("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);

//ADD DOCTOR TO THE HOSPITAL
 hospitalRouter.post("/removeDoctor",authenticateHospital,hospitalController.removeDoctor);


 //View Appointments

 hospitalRouter.get("/viewAppointment/:page",authenticateHospital,hospitalController.viewAppointment);

export default hospitalRouter;
