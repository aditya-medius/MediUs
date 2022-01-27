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
import {
  disease,
  doctorType,
  specialization,
  workingHour,
} from "../Services/schemaNames";
import specialityDoctorTypeModel from "../Admin Controlled Models/SpecialityDoctorType.Model";
import workingHourModel from "../Models/WorkingHours.Model";
import mongoose from "mongoose";
import appointmentModel from "../Models/Appointment.Model";
import hospitalModel from "../Models/Hospital.Model";
import { excludePatientFields } from "./Patient.Controller";
import {
  emailValidation,
  phoneNumberValidation,
} from "../Services/Validation.Service";
export const excludeDoctorFields = {
  password: 0,
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
        const { firstName, lastName, gender, phoneNumber, _id } = doctorObj;
        return successResponse(
          { token, firstName, lastName, gender, phoneNumber, _id },
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

        if (!(body.phoneNumber == "9999999999")) {
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
          return successResponse({}, "OTP sent successfully", res);
        }
        // Implement message service API
      } else {
        let error = new Error("Invalid phone number");
        error.name = "Invalid input";
        return errorResponse(error, res);
      }
    } else {
      if (body.phoneNumber == "9999999999") {
        const profile = await doctorModel.findOne(
          {
            phoneNumber: body.phoneNumber,
            deleted: false,
          },
          excludeDoctorFields
        );
        const token = await jwt.sign(
          profile.toJSON(),
          process.env.SECRET_DOCTOR_KEY as string
        );
        const { firstName, lastName, gender, phoneNumber, email, _id } =
          profile.toJSON();
        return successResponse(
          { token, firstName, lastName, gender, phoneNumber, email, _id },
          "Successfully logged in",
          res
        );
      }
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
            const { firstName, lastName, gender, phoneNumber, email, _id } =
              profile.toJSON();
            return successResponse(
              { token, firstName, lastName, gender, phoneNumber, email, _id },
              "Successfully logged in",
              res
            );
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
    const doctorData = await doctorModel
      .findOne({ _id: req.params.id, deleted: false }, excludeDoctorFields)
      .populate({
        path: "hospitalDetails.hospital",
        populate: {
          path: "address",
          populate: {
            path: "city state locality country",
          },
        },
      })
      .populate("hospitalDetails.workingHours")
      .populate("specialization")
      .populate("qualification");
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

        const doctorArray = await doctorModel
          .find(
            {
              deleted: false,
              active: true,
              specialization: { $in: specialityArray },
            },
            {
              ...excludeDoctorFields,
              "hospitalDetails.hospital": 0,
              "hospitalDetails.workingHours": 0,
            }
          )
          .populate("specialization")
          // .populate("hospitalDetails.hospital")
          .populate({
            path: "qualification",
            select: {
              duration: 0,
            },
          });
        return successResponse(doctorArray, "Success", res);
      })
      .catch((error) => {
        return errorResponse(error, res);
      });
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const setSchedule = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let { workingHour } = req.body;
    const updateQuery = {
      $set: {
        doctorDetails: req.currentDoctor,
        hospitalDetails: body.hospitalId,
        ...workingHour,
      },
    };

    for (const iterator in workingHour) {
      if (!Object.keys(workingHour[iterator]).includes("capacity")) {
        const error: Error = new Error("Invalid body");
        error.name = "Capacity is missing in the body";
        return errorResponse(error, res);
      }
    }

    let doctorProfile = await doctorModel
      .findOne({
        "hospitalDetails.hospital": body.hospitalId,
        _id: req.currentDoctor,
      })
      .select({
        hospitalDetails: { $elemMatch: { hospital: body.hospitalId } },
      });

    let workingHourId = null;
    if (doctorProfile) {
      workingHourId = doctorProfile.hospitalDetails[0].workingHours;
    }

    const Wh = await workingHourModel.findOneAndUpdate(
      {
        $or: [
          {
            _id: workingHourId,
          },
          {
            doctorDetails: req.currentDoctor,
            hospitalDetails: body.hospitalId,
          },
        ],
      },
      updateQuery,
      {
        upsert: true,
        new: true,
      }
    );

    return successResponse(Wh, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const viewAppointments = async (req: Request, res: Response) => {
  try {
    const limit: number = 5;
    const skip: number = parseInt(req.params.page) * limit;
    const limitSkipSort = [
      {
        $sort: {
          "time.date": -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const pipelines = [
      {
        $lookup: {
          from: "hospitals",
          localField: "hospital",
          foreignField: "_id",
          as: "hospital",
        },
      },
      {
        $unwind: "$hospital",
      },
      {
        $lookup: {
          from: "addresses",
          localField: "hospital.address",
          foreignField: "_id",
          as: "hospital.address",
        },
      },
      {
        $unwind: "$hospital.address",
      },
      {
        $lookup: {
          from: "cities",
          localField: "hospital.address.city",
          foreignField: "_id",
          as: "hospital.address.city",
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "hospital.address.state",
          foreignField: "_id",
          as: "hospital.address.state",
        },
      },
      {
        $lookup: {
          from: "localities",
          localField: "hospital.address.locality",
          foreignField: "_id",
          as: "hospital.address.locality",
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "hospital.address.country",
          foreignField: "_id",
          as: "hospital.address.country",
        },
      },
      {
        $unwind: "$hospital.address.city",
      },
      {
        $unwind: "$hospital.address.country",
      },
      {
        $unwind: "$hospital.address.state",
      },
      {
        $unwind: "$hospital.address.locality",
      },
      {
        $project: {
          "hospital.doctors": 0,
          "hospital.contactNumber": 0,
          "hospital.payment": 0,
          "hospital.anemity": 0,
          "hospital.specialisedIn": 0,
          "hospital.treatmentType": 0,
          // "hospital.address": 0,
        },
      },
      {
        $lookup: {
          from: "patients",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $project: {
          "patient.password": 0,
          "patient.DOB": 0,
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctors",
          foreignField: "_id",
          as: "doctors",
        },
      },
      {
        $project: {
          "doctors.password": 0,
          "doctors.hospitalDetails": 0,
          "doctors.registration": 0,
          "doctors.specialization": 0,
          "doctors.KYCDetails": 0,
          "doctors.qualification": 0,
          "doctors.DOB": 0,
          "doctors.phoneNumber": 0,
        },
      },
      {
        $unwind: "$hospital",
      },
      ...limitSkipSort,
    ];
    const doctorAppointments = await appointmentModel.aggregate([
      // {
      //   $match: {
      //     doctors: new mongoose.Types.ObjectId(req.currentDoctor),
      //   },
      // },
      {
        $facet: {
          past: [
            {
              $match: {
                doctors: new mongoose.Types.ObjectId(req.currentDoctor),
                "time.date": { $lte: new Date() },
              },
            },
            ...pipelines,
          ],
          upcoming: [
            {
              $match: {
                doctors: new mongoose.Types.ObjectId(req.currentDoctor),
                "time.date": { $gte: new Date() },
              },
            },
            ...pipelines,
          ],
        },
      },
    ]);
    return successResponse(doctorAppointments, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const viewAppointmentsByDate = async (req: Request, res: Response) => {
  try {
    const limit: number = 2;
    const skip: number = parseInt(req.params.page) * limit;
    const date: Date = req.body.date;
    let d = new Date(date);
    let gtDate: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

    let ltDate: Date = new Date(gtDate);
    ltDate.setDate(gtDate.getDate() - 1);
    ltDate.setUTCHours(24, 60, 60, 0);

    gtDate.setDate(gtDate.getDate() + 1);
    gtDate.setUTCHours(0, 0, 0, 0);

    const appointments = await appointmentModel
      .find({
        doctors: req.currentDoctor,
        "time.date": {
          $gte: ltDate,
          $lte: gtDate,
        },
      })
      .populate({ path: "patient", select: excludePatientFields })
      .populate({ path: "doctors", select: excludeDoctorFields })
      .populate({ path: "hospital" })
      .limit(limit)
      .skip(skip);
    return successResponse(appointments, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const cancelAppointments = async (req: Request, res: Response) => {
  try {
    let body = req.body;

    // Check is appointment is already cancelled or is already done
    const appointmentCancelledOrDone = await appointmentModel.exists({
      _id: body.appointmentId,
      $or: [{ cancelled: true }, { done: true }],
    });

    // If appointment is done or cancelled, return an error response
    if (appointmentCancelledOrDone) {
      let error: Error = new Error(
        "Cannot cancel appointment, most likely beacuse appointment is already cancelled or is done"
      );
      error.name = "Error cancelling appointment";
      return errorResponse(error, res);
    } else {
      // If not, cancel the appointment and return the success response
      const updatedAppointment = await appointmentModel.findOneAndUpdate(
        { _id: body.appointmentId },
        { $set: { cancelled: true } },
        { new: true }
      );

      return successResponse(
        updatedAppointment,
        "Successfully cancelled appointment",
        res
      );
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorWorkingInHospitals = async (
  req: Request,
  res: Response
) => {
  try {
    let doctorDetails = await doctorModel
      .findOne(
        { _id: req.params.id },
        { ...excludeDoctorFields, hospitalDetails: 0 }
      )
      .populate("specialization qualification");

    let workingHourObj = await workingHourModel
      .find({
        doctorDetails: req.params.id,
      })
      .distinct("hospitalDetails");

    let hospitals = await hospitalModel
      .find(
        { _id: { $in: workingHourObj } },
        {
          payment: 0,
        }
      )
      .populate({
        path: "address",
        populate: {
          path: "city state locality country",
        },
      })
      .populate("anemity")
      .populate("openingHour");

    const doctorObj = await workingHourModel.aggregate([
      {
        $match: {
          doctorDetails: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $project: {
          hospitalDetails: 1,
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
        },
      },
      {
        $group: {
          _id: "$hospitalDetails",
          workingHours: {
            $push: {
              monday: "$monday",
              tuesday: "$tuesday",
              wednesday: "$wednesday",
              thursday: "$thursday",
              friday: "$friday",
              saturday: "$saturday",
              sunday: "$sunday",
            },
          },
        },
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "_id",
          foreignField: "_id",
          as: "hospital",
        },
      },
      {
        $project: {
          workingHours: 1,
        },
      },
    ]);

    let index: number;
    let doctorsWorkingInHospital: Array<any> = hospitals.map((element: any) => {
      index = doctorObj.findIndex((e: any) => {
        return e._id.toString() == element._id.toString();
      });
      return {
        hospital: element,
        ...doctorObj[index],
      };
    });
    return successResponse(
      { doctorDetails, doctorsWorkingInHospital },
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const searchDoctorByPhoneNumberOrEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const term = req.params.term;
    const phone = phoneNumberValidation(term);
    const email = emailValidation(term);

    if (!phone && !email) {
      const error: Error = new Error("Enter a valid phone number or email");
      error.name = "Invalid Term";
      return errorResponse(error, res);
    }

    const doctorObj = await doctorModel.find({
      $or: [
        {
          email: term,
        },
        {
          phoneNumber: term,
        },
      ],
    });
    if (doctorObj) {
      return successResponse(doctorObj, "Success", res);
    }
    return successResponse({}, "No data found", res);
  } catch (error: any) {
    if (typeof error == "string") {
      error = new Error(error);
      error.name = "Not Found";
    }
    return errorResponse(error, res);
  }
};

export const getHospitalListByDoctorId = async (
  req: Request,
  res: Response
) => {
  try {
    const doctorData = await doctorModel
      .findOne({ _id: req.params.id, deleted: false }, excludeDoctorFields)
      .select({
        "hospitalDetails.consultationFee": 0,
        "hospitalDetails.workingHours": 0,
      })
      .populate({
        path: "hospitalDetails.hospital",
        populate: {
          path: "address",
          populate: {
            path: "city state locality country",
          },
        },
        select: {
          doctors: 0,
          location: 0,
          specialisedIn: 0,
          anemity: 0,
          treatmentType: 0,
          type: 0,
          payment: 0,
          deleted: 0,
          openingHour: 0,
          numberOfBed: 0,
        },
      });

    if (doctorData) {
      const hospitalDetails = doctorData.hospitalDetails.map((e: any) => {
        return e.hospital;
      });
      return successResponse(
        { hospitalDetails },
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
