import { Request, Response } from "express";
import { getDoctorsWithAdvancedFilters } from "../Services/Doctor/Doctor.Service";
import { errorResponse, successResponse } from "../Services/response";
import { createSuvedhaProfile } from "../Services/Suvedha/Suvedha.Service";

export const createProfile = async (req: Request, res: Response) => {
  try {
    let profile = await createSuvedhaProfile(req.body);
    return successResponse(profile, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  try {
    let doctors = await getDoctorsWithAdvancedFilters(req.query);
    return successResponse(doctors, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
