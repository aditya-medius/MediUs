import { Router } from "express";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import {
  getDoctorInfo,
  getDoctorInformation,
  getDoctors,
  getDoctorsInAHospital,
  getHospital,
  getValidDateOfDoctorsSchedule,
} from "../Controllers/suvedha.Controller";
import { oneOf } from "../Services/middlewareHelper";
const suvedhaRouter = Router();

suvedhaRouter.get("/getDoctors", oneOf(authenticateSuvedha), getDoctors);

suvedhaRouter.get(
  "/getDoctorById/:id",
  oneOf(authenticateSuvedha, authenticateHospital),
  getDoctorInfo
);

suvedhaRouter.post(
  "/getValidDateOfDoctorsSchedule",
  oneOf(authenticateSuvedha),
  getValidDateOfDoctorsSchedule
);

suvedhaRouter.post(
  "/getDoctorInfo",
  oneOf(authenticateSuvedha),
  getDoctorInformation
);

suvedhaRouter.get("/hospitalList", oneOf(authenticateSuvedha), getHospital);

suvedhaRouter.put(
  "/doctors/in/hospital",
  oneOf(authenticateSuvedha),
  getDoctorsInAHospital
);
export default suvedhaRouter;
