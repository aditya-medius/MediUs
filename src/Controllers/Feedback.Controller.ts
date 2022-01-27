import { Request, Response } from "express";
import feedbackModel from "../Models/Feedback.Model";
import { errorResponse, successResponse } from "../Services/response";
import { doctor, feedback, hospital, patient } from "../Services/schemaNames";
import { excludeDoctorFields } from "./Doctor.Controller";
import {
  excludeHospitalFields,
  excludePatientFields,
} from "./Patient.Controller";

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let InModel: string = "";
    if (req.currentDoctor) {
      InModel = doctor;
    } else if (req.currentHospital) {
      InModel = hospital;
    } else if (req.currentPatient) {
      InModel = patient;
    }
    body.InModel = InModel;
    const feedbackObj = await new feedbackModel(body).save();
    return successResponse(feedbackObj, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getAllFeedbacks = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let select;
    if (req.currentDoctor) {
      select = excludeDoctorFields;
    } else if (req.currentHospital) {
      select = excludeHospitalFields;
    } else if (req.currentPatient) {
      select = excludePatientFields;
    }
    const feedbackObj = await feedbackModel.find({}).populate({
      path: "userId",
      select,
    });
    // const feedbackObj = await feedbackModel.find({ InModel });
    return successResponse(feedbackObj, "Succes", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
