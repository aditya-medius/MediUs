import { Request, Response } from "express";
import doctorModel from "../Models/Doctors.Model";
import mediaModel from "../Models/Media.model";
import { errorResponse, successResponse } from "../Services/response";
import { doctor, hospital, patient } from "../Services/schemaNames";
import { excludeDoctorFields } from "./Doctor.Controller";
export const uploadImage = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let user: string = "";
    if (req.currentDoctor) {
      user = doctor;
    } else if (req.currentHospital) {
      user = hospital;
    } else if (req.currentPatient) {
      user = patient;
    }
    body.userType = user;
    body.user = req.body.userId;
    body.image = req.file
      ? `${process.env.MEDIA_DIR as string}/user/${req.file.filename}`
      : "";
    const mediaObj = await new mediaModel(body).save();

    await mediaObj.populate({ path: "user", select: excludeDoctorFields });

    return successResponse({ response: mediaObj }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
