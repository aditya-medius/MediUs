import { Request, Response } from "express";
import { errorResponse, successResponse } from "../Services/response";
import subPatientModel from "../Models/SubPatient.Model";
import patientModel from "../Models/Patient.Model";

export const addSubPatient = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.parentPatient = req.currentPatient;
    const subPatient = await new subPatientModel(body).save();
    return successResponse(subPatient, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getSubPatientList = async (req: Request, res: Response) => {
  try {
    // const subPatientList: Array<any> = await subPatientModel
    //   .find({
    //     parentPatient: req.currentPatient,
    //     deleted: false,
    //   })
    //   .lean();

    const subPatientList: Array<any> = await patientModel
      .find({
        parentPatient: req.currentPatient
      })
      .lean();

    let query = req.query;
    if (query.parent === "true") {
      const parent = await patientModel
        .findOne(
          {
            _id: req.currentPatient,
          },
          "firstName lastName DOB gender deleted"
        )
        .lean();
      parent["parentPatient"] = null;
      subPatientList.push(parent);
    }
    subPatientList.forEach((e: any) => {
      e["main"] = e.parentPatient ? false : true;
    });
    return successResponse(subPatientList, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const deleteSubPatient = async (req: Request, res: Response) => {
  try {
    const deletedSubPatient = await subPatientModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          deleted: true,
        },
      }
    );
    if (deletedSubPatient) {
      return successResponse(
        deletedSubPatient,
        "Successfully deleted patient",
        res
      );
    } else {
      return successResponse({}, "No patient found", res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getSubPatientById = async (req: Request, res: Response) => {
  try {
    const subPatientObj = await subPatientModel.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (subPatientObj) {
      return successResponse(subPatientObj, "Success", res);
    } else {
      return successResponse({}, "No patient found", res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const updateSubPatient = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    if ("gender" in body) {
      if (!["Male", "Female", "Other"].includes(body.gender)) {
        let error = new Error("Invalid gender");
        error.name = "Gender is invalid";
        return errorResponse(error, res);
      }
    }
    const subPatientObj = await subPatientModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...body,
        },
      },
      {
        new: true,
      }
    );
    if (subPatientObj) {
      return successResponse(subPatientObj, "Success", res);
    } else {
      return successResponse({}, "No Data Found", res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
