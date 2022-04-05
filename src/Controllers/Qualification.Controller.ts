import { Request, Response } from "express";
import qualificationModel from "../Models/Qualification.Model";
import qualificationNamesModel from "../Admin Controlled Models/QualificationName.Model";
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

export const getQualificationList = async (req: Request, res: Response) => {
  try {
    return successResponse(
      await qualificationNamesModel.find({ "del.deleted": false }),
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
