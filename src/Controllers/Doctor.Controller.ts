import { Request, Response } from "express";
import doctor from "../Models/Doctors.Model";
import { errorResponse, successResponse } from "../Services/response";

export const getAllDoctorsList = async (req: Request, res: Response) => {
  try {
    const doctorList = await doctor.find();
    successResponse(doctorList, "Successfully fetched doctor's list", res);
  } catch (error: any) {
    errorResponse(error, res);
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const doctorObj = await new doctor(req.body).save();
    successResponse(doctorObj, "Doctor profile successfully created", res);
  } catch (error: any) {
    errorResponse(error, res);
  }
};
