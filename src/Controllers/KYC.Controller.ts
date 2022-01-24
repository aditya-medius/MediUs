import kycModel from "../Models/KYC.Model";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../Services/response";
export const addKYC = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    const kycObj = await new kycModel(body).save();
    return successResponse(kycObj, "Successfully created KYC", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const updateKyc = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    const kycObj = await kycModel.findOneAndUpdate(
      {
        _id: body.id,
      },
      {
        $set: body,
      },
      { new: true }
    );

    return successResponse(kycObj, "Successfully updated KYC details", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
