import { Request, Response } from "express";
import patientModel from "../Models/Patient.Model";
import otpModel from "../Models/OTP.Model";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { errorResponse, successResponse } from "../Services/response";
// import { sendMessage } from "../Services/message.service";
import { sendMessage } from "../Services/message.service";

const excludePatientFields = {
  password: 0,
  verified: 0,
  DOB: 0,
};

// Get All Patients
export const getAllPatientsList = async (req: Request, res: Response) => {
  try {
    const patientList = await patientModel.find(
      {deleted: false}, 
      excludePatientFields
      );
    return successResponse(
      patientList,
      "Successfully fetched patient's list",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Create a new patient account(CREATE)
export const createPatient = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let cryptSalt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, cryptSalt);
    let patientObj = await new patientModel(body).save();
    jwt.sign(
      patientObj.toJSON(),
      process.env.SECRET_PATIENT_KEY as string,
      (err: any, token: any) => {
        if (err) return errorResponse(err, res);
        return successResponse(
          token,
          "Patient profile successfully created",
          res
        );
      }
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Login as a Patient
export const patientLogin = async (req: Request, res: Response) => {
  try {
    let body: any = req.query;
    if (!("OTP" in body)) {
      if (/^[0]?[6789]\d{9}$/.test(body.phoneNumber)) {
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        // Implement message service API
        sendMessage(`Your OTP is: ${OTP}`, body.phoneNumber)
          .then(async (message) => {
            const otpToken = jwt.sign(
              { otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 },
              OTP
            );
            // Add OTP and phone number to temporary collection
            await otpModel.findOneAndUpdate(
              { phoneNumber: body.phoneNumber },
              { $set: { phoneNumber: body.phoneNumber, otp: otpToken } },
              { upsert: true }
            );
          })
          .catch((error) => {
            throw error;
          });

        return successResponse({}, "OTP sent successfully", res);
      } else {
        let error = new Error("Invalid phone number");
        error.name = "Invalid input";
        return errorResponse(error, res);
      }
    } else {
      const otpData = await otpModel.findOne({
        phoneNumber: body.phoneNumber,
      });
      try {
        const data: any = await jwt.verify(otpData.otp, body.OTP);
        if (Date.now() > data.expiresIn)
          return errorResponse(new Error("OTP expired"), res);
        if (body.OTP === data.otp) {
          const profile = await patientModel.findOne(
            {
              phoneNumber: body.phoneNumber,
              deleted: false,
            },
            excludePatientFields
          );
          if (profile) {
            const token = await jwt.sign(
              profile.toJSON(),
              process.env.SECRET_PATIENT_KEY as string
            );
            otpData.remove();
            return successResponse(token, "Successfully logged in", res);
          } else {
            otpData.remove();
            return successResponse(
              { message: "No Data found" },
              "Create a new profile",
              res,
              201
            );
          }
        } else {
          const error = new Error("Invalid OTP");
          error.name = "Invalid";
          return errorResponse(error, res);
        }
      } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
          const error = new Error("OTP isn't valid");
          error.name = "Invalid OTP";
          return errorResponse(error, res);
        }
        return errorResponse(err, res);
      }
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
// Get Patient By Patient Id(READ)
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patientData = await patientModel.findOne(
      { _id: req.params.id, deleted: false },
      excludePatientFields
    );
    if (patientData) {
      return successResponse(
        patientData,
        "Successfully fetched patient details",
        res
      );
    } else {
      const error: Error = new Error("Patient not found");
      error.name = "Not found";
      return errorResponse(error, res, 404);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Get patient By Hospital(UPDATE)
export const getPatientByHospitalId = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return errorResponse(error, res);
  }
};
export const updatePatientProfile = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    const updatedPatientObj = await patientModel.findOneAndUpdate(
      {
        _id: req.currentPatient,
        deleted: false,
      },
      {
        $set: body,
      },
      {
        fields: excludePatientFields,
        new: true,
      }
    );
    if (updatedPatientObj) {
      return successResponse(
        updatedPatientObj,
        "Profile updated successfully,",
        res
      );
    } else {
      let error = new Error("Profile doesn't exist");
      error.name = "Not Found";
      return errorResponse(error, res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Delete patient profile(DELETE)
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const patientProfile = await patientModel.findOneAndUpdate(
      { _id: req.currentPatient, deleted: false },
         { $set: { deleted: true } }
    );
    if (patientProfile) {
      return successResponse({}, "Patient Profile deleted successfully", res);
    } else {
      let error = new Error("Patient Profile doesn't exist");
      error.name = "Not found";
      return errorResponse(error, res, 404);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
};