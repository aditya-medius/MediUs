import { Request, Response } from "express";
import qualificationModel from "../Models/Qualification.Model";
import { errorResponse, successResponse } from "../Services/response";

export const addDoctorQualification = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    const qualificationDoc = await new qualificationModel(body).save();
    return successResponse(qualificationDoc, "Success", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
