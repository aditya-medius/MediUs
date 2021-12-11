import { Request, Response } from "express";
import doctorModel from "../Models/Doctors.Model";
import otpModel from "../Models/OTP.Model";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { errorResponse, successResponse } from "../Services/response";
import { sendMessage } from "../Services/message.service";
import specialityBodyModel from "../Admin Controlled Models/SpecialityBody.Model";
import bodyPartModel from "../Admin Controlled Models/BodyPart.Model";
import _ from "underscore";
import specialityDiseaseModel from "../Admin Controlled Models/SpecialityDisease.Model";
import { disease, specialization } from "../Services/schemaNames";
const excludeDoctorFields = {
  // password: 0,
  // panCard: 0,
  // adhaarCard: 0,
  verified: 0,
  registrationDate: 0,
  DOB: 0,
  registration: 0,
  KYCDetails: 0,
};

// Get All Doctors
export const getAllDoctorsList = async (req: Request, res: Response) => {
  try {
    const doctorList = await doctorModel.find(
      { deleted: false },
      excludeDoctorFields
    );
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
          const profile = await doctorModel.findOne(
            {
              phoneNumber: body.phoneNumber,
              deleted: false,
            },
            excludeDoctorFields
          );
          if (profile) {
            const token = await jwt.sign(
              profile.toJSON(),
              process.env.SECRET_DOCTOR_KEY as string
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

// Get Doctor By Doctor Id
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctorData = await doctorModel.findOne(
      { _id: req.params.id, deleted: false },
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

export const updateDoctorProfile = async (req: Request, res: Response) => {
  try {
    let { hospitalDetails, specialization, qualification, ...body } = req.body;
    const updateQuery = {
      $set: body,
      $addToSet: { hospitalDetails, specialization, qualification },
    };
    const updatedDoctorObj = await doctorModel.findOneAndUpdate(
      {
        _id: req.currentDoctor,
        deleted: false,
      },
      updateQuery,
      {
        fields: excludeDoctorFields,
        new: true,
      }
    );
    if (updatedDoctorObj) {
      return successResponse(
        updatedDoctorObj,
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

/*
  Agar yeh doctor kissi hospital array me hai
  to isko waha se hatane k zaroorat nhi, uski vjhaye
  jab uss hospital k doctors ko GET kre to ek filter lagaye jisse
  k soft deleted doctors return na ho.
*/
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const doctorProfile = await doctorModel.findOneAndUpdate(
      { _id: req.currentDoctor, deleted: false },
      { $set: { deleted: true } }
    );
    if (doctorProfile) {
      return successResponse({}, "Profile deleted successfully", res);
    } else {
      let error = new Error("Profile doesn't exist");
      error.name = "Not found";
      return errorResponse(error, res, 404);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
};

// Get doctor by speciality or body parts
export const searchDoctor = async (req: Request, res: Response) => {
  try {
    const term = req.params.term;
    const promiseArray: Array<any> = [
      specialityBodyModel.aggregate([
        {
          $facet: {
            bySpeciality: [
              {
                $lookup: {
                  from: "specializations",
                  localField: "speciality",
                  foreignField: "_id",
                  as: "byspeciality",
                },
              },
              {
                $match: {
                  "byspeciality.specialityName": {
                    $regex: term,
                    $options: "i",
                  },
                },
              },
              {
                $project: {
                  speciality: 1,
                  _id: 0,
                },
              },
            ],
            byBodyPart: [
              {
                $lookup: {
                  from: "bodyparts",
                  localField: "bodyParts",
                  foreignField: "_id",
                  as: "bodyPart",
                },
              },
              {
                $match: {
                  "bodyPart.bodyPart": { $regex: term, $options: "i" },
                },
              },
              {
                $project: {
                  speciality: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            BodyAndSpeciality: {
              $setUnion: ["$bySpeciality", "$byBodyPart"],
            },
          },
        },
        { $unwind: "$BodyAndSpeciality" },
        { $replaceRoot: { newRoot: "$BodyAndSpeciality" } },
      ]),
      specialityDiseaseModel.aggregate([
        {
          $facet: {
            bySpeciality: [
              {
                $lookup: {
                  from: specialization,
                  localField: "speciality",
                  foreignField: "_id",
                  as: "byspeciality",
                },
              },
              {
                $match: {
                  "byspeciality.specialityName": {
                    $regex: term,
                    $options: "i",
                  },
                },
              },
              {
                $project: {
                  speciality: 1,
                  _id: 0,
                },
              },
            ],
            byDisease: [
              {
                $lookup: {
                  from: disease,
                  localField: "disease",
                  foreignField: "_id",
                  as: "disease",
                },
              },
              {
                $match: {
                  "disease.disease": { $regex: term, $options: "i" },
                },
              },
              {
                $project: {
                  speciality: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            DiseaseAndSpeciality: {
              $setUnion: ["$bySpeciality", "$byDisease"],
            },
          },
        },
        { $unwind: "$DiseaseAndSpeciality" },
        { $replaceRoot: { newRoot: "$DiseaseAndSpeciality" } },
      ]),
    ];

    Promise.all(promiseArray)
      .then(async (specialityArray: Array<any>) => {
        specialityArray = specialityArray.flat();
        specialityArray = _.map(specialityArray, (e) => {
          return e.speciality;
        });

        const doctorArray = await doctorModel
          .find(
            {
              deleted: false,
              active: true,
              specialization: { $in: specialityArray },
            },
            excludeDoctorFields
          )
          .populate("specialization")
          .populate("hospitalDetails.hospital");
        return successResponse(doctorArray, "Success", res);
      })
      .catch((error) => {
        return errorResponse(error, res);
      });
  } catch (error) {
    return errorResponse(error, res);
  }
};
