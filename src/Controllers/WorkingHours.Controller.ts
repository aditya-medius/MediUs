import workingHourModel from "../Models/WorkingHours.Model";
import { Request, Response, Router } from "express";
import { errorResponse, successResponse } from "../Services/response";

export const createWorkingHours = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    const WHObj = await new workingHourModel(body).save();
    return successResponse(WHObj, "Successfully created", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
