import { Request, Response } from "express";
import preferredPharmaModel from "../Models/PreferredPharma.Model";
import * as jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../Services/response";
import mongoose from "mongoose";

//add the pharma
export const addPharma = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let pharmaObj = await new preferredPharmaModel(body).save();
    if (pharmaObj) {
      return successResponse(pharmaObj, "Successfully added the Pharma", res);
    } else {
      let error = new Error("Can't add pharmacy");
      return errorResponse(error, res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

//get all the pharma
export const getPharma = async (req: Request, res: Response) => {
  try {
    const pharmaList = await preferredPharmaModel
      .find({ deleted: false })
      .populate([
        {
          path: "address",
          populate: {
            path: "city state locality country",
          },
        },
      ]);
    if (pharmaList.length > 0)
      return successResponse(pharmaList, "Successfully Fetched Pharmacy", res);
    else {
      let error = new Error("No Pharmacy Found!");
      return errorResponse(error, res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

//delete the pharma
export const delPharma = async (req: Request, res: Response) => {
  try {
    const pharmaList = await preferredPharmaModel.findOneAndUpdate(
      { deleted: false, _id: req.params.id },
      { $set: { deleted: true } }
    );
    if (pharmaList)
      return successResponse({}, "Pharma Deleted Successfully", res);
    else {
      let error = new Error("Pharmacy doesnot exist");
      return errorResponse(error, res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

//update the pharma
export const updatePharma = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const pharmaObj = await preferredPharmaModel.findOneAndUpdate(
      { deleted: false, _id: req.params.id },
      { $set: { name: body.name, updated: true } }
    );
    if (pharmaObj)
      return successResponse({}, "Successfully updated the Pharmacy", res);
    else {
      let error = new Error("No Phramacy Found!");
      error.name = "Invalid Pharmacy Id";
      return errorResponse(error, res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
