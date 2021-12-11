import { Router } from "express";
import * as workingHourController from "../Controllers/WorkingHours.Controller";
const workingHourRouter = Router();

workingHourRouter.post("/", workingHourController.createWorkingHours);
export default workingHourRouter;
