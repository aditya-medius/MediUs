import { Request, Response } from "express";
import doctorModel from "../Models/Doctors.Model";
import mediaModel from "../Models/Media.model";
import { errorResponse, successResponse } from "../Services/response";
import { doctor, hospital, patient, suvedha } from "../Services/schemaNames";
import { excludeDoctorFields } from "./Doctor.Controller";
export const uploadImage = async (
  req: Request,
  res: Response,
  paths: string = "user"
) => {
  try {
    let body = req.body;
    let user: string = "";
    if (req.currentDoctor) {
      user = doctor;
    } else if (req.currentHospital) {
      user = hospital;
    } else if (req.currentPatient) {
      user = patient;
    } else if (req.currentSuvedha) {
      user = suvedha;
    } else if (req.currentAdmin) {
      user = body.user;
    }
    const mediaBody = {
      userType: user,
      user: body.userId,
      image: req.file
        ? `${process.env.MEDIA_DIR as string}/${paths}/${req.file.filename}`
        : ""
    }
    let mediaObj = await new mediaModel(mediaBody).save();

    return successResponse({ response: mediaObj }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
