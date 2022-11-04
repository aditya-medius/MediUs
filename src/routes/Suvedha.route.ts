import { Router } from "express";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import { getDoctorInfo, getDoctors } from "../Controllers/suvedha.Controller";
import { oneOf } from "../Services/middlewareHelper";
const suvedhaRouter = Router();

suvedhaRouter.get("/getDoctors", oneOf(authenticateSuvedha), getDoctors);

suvedhaRouter.get(
  "/getDoctorById/:id",
  oneOf(authenticateSuvedha, authenticateHospital),
  getDoctorInfo
);
export default suvedhaRouter;
