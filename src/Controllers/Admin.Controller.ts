import { Request, Response } from "express";
import bodyPartModel from "../Admin Controlled Models/BodyPart.Model";
import specialityBodyModel from "../Admin Controlled Models/SpecialityBody.Model";
import specialityModel from "../Admin Controlled Models/Specialization.Model";
import { errorResponse, successResponse } from "../Services/response";

export const addSpeciality = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const data = await new specialityModel(body).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const addBodyPart = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const data = await new bodyPartModel(body).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const addSpecialityBody = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.bodyParts = [...new Set(body.bodyParts)];
    const data = await new specialityBodyModel({
      speciality: body.speciality,
      bodyParts: body.bodyParts,
    }).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const addToSpecialityBody = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.bodyParts = [...new Set(body.bodyParts)];
    const data = await specialityBodyModel.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { bodyParts: body.bodyParts } },
      { new: true }
    );
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
