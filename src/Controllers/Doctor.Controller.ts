import { Request, Response } from "express";
import doctorModel from "../Models/Doctors.Model";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { errorResponse, successResponse } from "../Services/response";

const excludeDoctorFields = {
  password: 0,
  panCard: 0,
  adhaarCard: 0,
  verified: 0,
  registrationDate: 0,
  DOB: 0,
};

// Get All Doctors
export const getAllDoctorsList = async (req: Request, res: Response) => {
  try {
    const doctorList = await doctorModel.find({}, excludeDoctorFields);
    return successResponse(
      doctorList,
      "Successfully fetched doctor's list",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Create a new doctor account
export const createDoctor = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let cryptSalt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, cryptSalt);
    let doctorObj = await new doctorModel(body).save();
    jwt.sign(
      doctorObj.toJSON(),
      process.env.SECRET_DOCTOR_KEY as string,
      (err: any, token: any) => {
        if (err) return errorResponse(err, res);
        return successResponse(
          token,
          "Doctor profile successfully created",
          res
        );
      }
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Login as Doctor
export const doctorLogin = async (req: Request, res: Response) => {
  try {
    const doctorDetail = await doctorModel.findOne({
      email: req.body.email,
    });
    if (doctorDetail) {
      try {
        const encryptResult = await bcrypt.compare(
          req.body.password,
          doctorDetail.password
        );
        if (encryptResult) {
          const token = await jwt.sign(
            doctorDetail.toJSON(),
            process.env.SECRET_DOCTOR_KEY as string
          );
          return successResponse(token, "Successfully logged in", res);
        } else {
          const error: Error = new Error("Invalid Password");
          error.name = "Authentication Error";
          return errorResponse(error, res);
        }
      } catch (error: any) {
        return errorResponse(error, res, 401);
      }
    } else {
      const error: Error = new Error("Invalid Email");
      error.name = "Authentication Error";
      return errorResponse(error, res, 401);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Get Doctor By Doctor Id
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctorData = await doctorModel.findOne(
      { _id: req.params.id },
      excludeDoctorFields
    );
    if (doctorData) {
      return successResponse(
        doctorData,
        "Successfully fetched doctor details",
        res
      );
    } else {
      const error: Error = new Error("Doctor not found");
      error.name = "Not found";
      return errorResponse(error, res, 404);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Get Doctor By Hospital
export const getDoctorByHospitalId = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return errorResponse(error, res);
  }
};
