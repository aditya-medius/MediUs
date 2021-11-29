import express, { Request, Response } from "express";
import * as doctorController from "../Controllers/Doctor.Controller";
const doctorRouter = express.Router();

doctorRouter.get("/", doctorController.getAllDoctorsList);
doctorRouter.post("/", doctorController.createDoctor);

export default doctorRouter;
