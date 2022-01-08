import { json, Request, Response } from "express";
import addressModel from "../Models/Address.Model";
import anemityModel from "../Models/Anemities.Model";
import hospitalModel from "../Models/Hospital.Model";
import specialityModel from "../Models/Speciality.Model";
import { errorResponse, successResponse } from "../Services/response";
import * as jwt from "jsonwebtoken";
import specialityBodyModel from "../Admin Controlled Models/SpecialityBody.Model";
import specialityDiseaseModel from "../Admin Controlled Models/SpecialityDisease.Model";
import specialityDoctorTypeModel from "../Admin Controlled Models/SpecialityDoctorType.Model";
import {
  appointment,
  disease,
  doctorType,
  specialization,
} from "../Services/schemaNames";
import _ from "underscore";
import doctorModel from "../Models/Doctors.Model";
import { Mongoose } from "mongoose";
import appointmentModel from "../Models/Appointment.Model";
import { date } from "joi";
import otpModel from "../Models/OTP.Model";
import { sendMessage } from "../Services/message.service";
import { GeoJSON } from "geojson";
const excludeDoctorFields = {
  password: 0,
  // panCard: 0,
  // adhaarCard: 0,
  verified: 0,
  registrationDate: 0,
  DOB: 0,
  registration: 0,
  KYCDetails: 0,
};

export const login = async (req: Request, res: Response) => {
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
          const profile = await hospitalModel.findOne(
            {
              contactNumber: body.phoneNumber,
              deleted: false,
            }          
            );
          if (profile) {
            const token = await jwt.sign(
              profile.toJSON(),
              process.env.HOSPITAL_LOGIN_KEY as string
            );
            otpData.remove();
            return successResponse(token, "Successfully logged in", res);
          } else {
            otpData.remove();
            return successResponse(
              { message: "No Data found" },
              "Create a new Hospital",
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

//get all hospitals
export const getAllHospitalsList = async (req: Request, res: Response) => {
  try {
    const hospitalList = await hospitalModel.find({ deleted: false }).populate([
      {
        path: "address",
        populate: {
          path: "city state locality country",
        },
      },
      { path: "anemity" },
      { path: "payment" },
      { path: "specialisedIn" },
      { path: "doctors" },
    ]);

    return successResponse(
      hospitalList,
      "Successfully fetched Hospital's list",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

//get myHospital
export const myHospital=async (req: Request, res: Response)=>{
  try{
    const hospital=await hospitalModel.find({
      deleted: false,
      _id: req.currentHospital
    });
  return successResponse(hospital, "Successfully fetched Hospital", res);
  }
   catch (error: any) {
    return errorResponse(error, res);
  }
};

//create a hospital
export const createHospital = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let addressObj = await new addressModel(body.address).save();
    body["address"] = addressObj._id;
    let hospitalObj = await new hospitalModel(body).save();
    jwt.sign(
      hospitalObj.toJSON(),
      process.env.SECRET_HOSPITAL_KEY as string,
      (err: any, token: any) => {
        if (err) return errorResponse(err, res);
        const { name, _id } = hospitalObj;
        return successResponse(
          { token, name, _id },
          "Hospital created successfully",
          res
        );
      }
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

//add anemity
export const createHospitalAnemity = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let anemityObj = await new anemityModel(body).save();
    return successResponse(
      anemityObj,
      "Address has been successfully added",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

//add hospital speciality
// export const addHospitalSpeciality= async(req:Request, res:Response)=>{
//   try{
//     let body=req.body;
//     let specialityObj=await new hospitalSpecialityModel(body).save();
//       return successResponse(specialityObj, "Speciality has been successfully added",res);
//   }
//   catch(error: any){
//     return errorResponse(error, res);
//   }
// };

export const deleteHospital = async (req: Request, res: Response) => {
  try {
    const HospitalDel = await hospitalModel.findOneAndUpdate(
      { _id: req.currentHospital, deleted: false },
      { $set: { deleted: true } }
    );
    if (HospitalDel) {
      return successResponse({}, "Hospital deleted successfully", res);
    } else {
      let error = new Error("Hospital doesn't exist");
      error.name = "Not found";
      return errorResponse(error, res, 404);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
};
export const updateHospital = async (req: Request, res: Response) => {
  try {
    let {
      doctors,
      anemity,
      payment,
      contactNumber,
      numberOfBed,
      type,
      ...body
    } = req.body;
    const updateQuery = {
      $set: { body, numberOfBed, type },
      $addToSet: {
        doctors,
        anemity,
        payment,
      },
    };
    const DoctorObj = await doctorModel.find({ deleted: false, _id: doctors });
    // console.log(doctors.length);
    if (DoctorObj.length == doctors.length) {
      const HospitalUpdateObj = await hospitalModel.findOneAndUpdate(
        { _id: req.currentHospital, deleted: false },
        updateQuery,
        { new: true }
      );
      if (HospitalUpdateObj) {
        return successResponse(
          HospitalUpdateObj,
          "Hospital updated successfully",
          res
        );
      } else {
        let error = new Error("Hospital doesn't exist");
        error.name = "Not found";
        return errorResponse(error, res, 404);
      }
    } else {
      let error = new Error("Doctor doesn't exist");
      error.name = "Not Found";
      return errorResponse(error, res, 404);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
};

// Get Hospital by speciality or body parts
export const searchHospital = async (req: Request, res: Response) => {
  try {
    const term = req.params.term;
    const promiseArray: Array<any> = [
      specialityBodyModel.aggregate([
        {
          $facet: {
            bySpeciality: [
              {
                $lookup: {
                  from: "specialization",
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
      specialityDoctorTypeModel.aggregate([
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
            byDoctorType: [
              {
                $lookup: {
                  from: doctorType,
                  localField: "doctorType",
                  foreignField: "_id",
                  as: "doctorType",
                },
              },
              {
                $match: {
                  "doctorType.doctorType": { $regex: term, $options: "i" },
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
            DoctorTypeAndSpeciality: {
              $setUnion: ["$bySpeciality", "$byDoctorType"],
            },
          },
        },
        { $unwind: "$DoctorTypeAndSpeciality" },
        { $replaceRoot: { newRoot: "$DoctorTypeAndSpeciality" } },
      ]),
    ];

    Promise.all(promiseArray)
      .then(async (specialityArray: Array<any>) => {
        specialityArray = specialityArray.flat();
        specialityArray = _.map(specialityArray, (e) => {
          return e.speciality;
        });
        const hospitalArray = await hospitalModel
          .find({
            $or: [
              {
                deleted: false,
                active: true,
                specialisedIn: { $in: specialityArray },
                // doctors: {specialization: {$in: specialityArray}}
              },
              {
                type: term,
              },
            ],
          })
          .populate({ path: "specialisedIn" })
          .populate({
            path: "address",
            populate: {
              path: "city state country locality",
            },
          })
          .populate("doctors");
        // .populate("anemity")
        // .populate("openingHour");
        return successResponse(hospitalArray, "Success", res);
      })
      .catch((error) => {
        return errorResponse(error, res);
      });
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const removeDoctor = async (req: Request, res: Response) => {
  try {
    let { doctors } = req.body;
    const doctorProfile = await doctorModel.findOne({
      deleted: false,
      _id: doctors,
    });
    if (doctorProfile) {
      const hospitalDoctor = await hospitalModel.findOneAndUpdate(
        { _id: req.currentHospital, doctors: { $in: doctors } },
        { $pull: { doctors: doctors } }
      );
      return successResponse(
        hospitalDoctor,
        "Doctor Removed Successfully",
        res
      );
    }
    let error = new Error("Doctor doesnot exist");
    error.name = "Not Found";
    return errorResponse(error, res, 404);
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const viewAppointment = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.params.page);
    const appointmentObj: Array<object> = await appointmentModel
      .find({ hospital: req.currentHospital, "time.date": { $gt: Date() } })
      .sort({ "time.date": 1 })
      .skip(page > 1 ? (page - 1) * 2 : 0)
      .limit(2);

    const page2 = appointmentObj.length / 2;

    const older_apppointmentObj: Array<object> = await appointmentModel
      .find({ hospital: req.currentHospital, "time.date": { $lte: Date() } })
      .sort({ "time.date": 1 })
      .skip(page > page2 ? (page - 1) * 2 : 0)
      .limit(2);

    const allAppointment = appointmentObj.concat(older_apppointmentObj);

    if (allAppointment.length > 0)
      return successResponse(allAppointment, "Appointments found", res);
    else {
      let error = new Error("No appointments found");
      return errorResponse(error, res, 404);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
};
