import express, { Request, Response } from "express";
import * as mediaController from "../Controllers/Media.Controller";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import { authenticatePatient } from "../authentication/Patient.auth";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticateAdmin } from "../authentication/Admin.auth";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import { oneOf } from "../Services/middlewareHelper";
import { initUpload } from "../Services/Utils";
import { errorResponse, successResponse } from "../Services/response";
import * as hospitalService from "../Services/Hospital/Hospital.Service";

const commonRouter = express.Router();

let paths = "admin";
const upload = initUpload(paths);

commonRouter.post(
  "/uploadImage",
  oneOf(
    authenticateDoctor,
    authenticateHospital,
    authenticatePatient,
    authenticateAdmin,
    authenticateSuvedha
  ),
  upload.single("profileImage"),
  (req: Request, res: Response) => {
    mediaController.uploadImage(req, res, paths);
  }
);

commonRouter.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    return successResponse({ response: req.file }, "Success", res);
  }
);

commonRouter.get(
  "/cities",
  oneOf(
    authenticateDoctor,
    authenticateHospital,
    authenticatePatient,
    authenticateAdmin,
    authenticateSuvedha
  ),
  async (req: Request, res: Response) => {
    try {
      let cities = await hospitalService.getCitiesWhereHospitalsExist();
      return successResponse({ cities }, "Success", res);
    } catch (error: any) {
      return errorResponse(error, res);
    }
  }
);

commonRouter.get("/app/version/:app", async (req: Request, res: Response) => {
  try {
    let { app } = req.params;
    const status = process.env.APP_STATUS as string;
    console.log("status", status);
    let obj: any;
    switch (app) {
      case "medius_user": {
        obj = { version: parseInt(process.env.medius_user_version as string) };
        break;
      }
      case "medius_clinic": {
        obj = {
          version: parseInt(process.env.medius_clinic_version as string),
        };
        break;
      }
      case "medius_doctor": {
        obj = {
          version: parseInt(process.env.medius_doctor_version as string),
        };
        break;
      }
    }
    switch (status) {
      case "maintenance": {
        obj = {
          ...obj,
          status: false,
          msg: "Application is under maintenance",
        };
        break;
      }

      case "online": {
        obj = {
          ...obj,
          status: true,
          msg: "Application is online",
        };
        break;
      }
    }

    return successResponse({ ...obj }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
});

export default commonRouter;
