import { Request, Response } from "express";
import hospital from "../Models/Hospital.Model";
import { errorResponse, successResponse } from "../Services/response";

export const getAllHospitalsList = async (req: Request, res: Response) => {
  try {
    const hospitalList = await hospital.find();
    return successResponse(hospitalList, "Successfully fetched Hospital's list", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const createHospital = async (req: Request, res: Response) => {
  try {
    const hospitalObj = await new hospital(req.body).save();
    return successResponse(hospitalObj, "Doctor profile successfully created", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
