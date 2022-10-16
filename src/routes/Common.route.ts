import express, { Request, Response } from "express";
import * as mediaController from "../Controllers/Media.Controller";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import { authenticatePatient } from "../authentication/Patient.auth";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticateAdmin } from "../authentication/Admin.auth";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import { oneOf } from "../Services/middlewareHelper";
import { initUpload } from "../Services/Utils";
import { successResponse } from "../Services/response";

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

export default commonRouter;
