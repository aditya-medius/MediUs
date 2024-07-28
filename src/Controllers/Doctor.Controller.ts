import { Request, Response } from "express";
import doctorModel from "../Models/Doctors.Model";
import otpModel from "../Models/OTP.Model";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { errorResponse, successResponse } from "../Services/response";
import { sendMessage } from "../Services/message.service";
import specialityBodyModel from "../Admin Controlled Models/SpecialityBody.Model";
import specialityModel from "../Admin Controlled Models/Specialization.Model";
import bodyPartModel from "../Admin Controlled Models/BodyPart.Model";
import _ from "underscore";
import * as lodash from "lodash";
import specialityDiseaseModel from "../Admin Controlled Models/SpecialityDisease.Model";
import {
  appointment,
  disease,
  doctor,
  doctorType,
  holidayCalendar,
  hospital,
  specialization,
  suvedha,
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
import { formatWorkingHour } from "../Services/WorkingHour.helper";
import orderModel from "../Models/Order.Model";
import appointmentPaymentModel from "../Models/AppointmentPayment.Model";
import * as doctorService from "../Services/Doctor/Doctor.Service";
import withdrawModel from "../Models/Withdrawal.Model";
import qualificationModel from "../Models/Qualification.Model";
import {
  calculateAge,
  getHospitalsInACity,
} from "../Services/Helpers/Patient.Service";
import * as approvalService from "../Services/Approval-Request/Approval-Request.Service";
import * as holidayService from "../Services/Holiday-Calendar/Holiday-Calendar.Service";
import * as hospitalService from "../Services/Hospital/Hospital.Service";
import * as prescriptionController from "../Controllers/Prescription-Validity.Controller";
export const excludeDoctorFields = {
  password: 0,
  // panCard: 0,
  // adhaarCard: 0,
  // verified: 0,
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
    if (body.password) {
      let cryptSalt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, cryptSalt);
    }
    let doctorObj = await new doctorModel(body).save();

    if (body?.specialization) {
      specialityModel
        .updateMany(
          { _id: { $in: body?.specialization } },
          { $set: { active: true } }
        )
        .then();
    }
    await doctorObj.populate("qualification");
    doctorObj = doctorObj.toObject();
    doctorObj.qualification = doctorObj.qualification[0];
    jwt.sign(
      doctorObj,
      process.env.SECRET_DOCTOR_KEY as string,
      (err: any, token: any) => {
        if (err) return errorResponse(err, res);
        const {
          firstName,
          lastName,
          gender,
          phoneNumber,
          _id,
          qualification,
          verified,
        } = doctorObj;
        return successResponse(
          {
            token,
            firstName,
            lastName,
            gender,
            phoneNumber,
            _id,
            qualification,
            verified,
          },
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

        if (!(body.phoneNumber == "9999799997")) {
          // sendMessage(`Your OTP is: ${OTP}`, body.phoneNumber)
          //   .then(async (message) => {})
          //   .catch((error) => {
          //     throw error;
          //   });

          digiMilesSMS.sendOTPToPhoneNumber(body.phoneNumber, OTP);
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
        const profile = await doctorModel
          .findOne(
            {
              phoneNumber: body.phoneNumber,
              deleted: false,
            },
            excludeDoctorFields
          )
          .populate("qualification");

        if (profile) {
          const token = await jwt.sign(
            profile.toJSON(),
            process.env.SECRET_DOCTOR_KEY as string
          );
          let {
            firstName,
            lastName,
            gender,
            phoneNumber,
            email,
            _id,
            qualification,
            preBookingTime,
          } = profile.toJSON();
          qualification = qualification[0];
          return successResponse(
            {
              token,
              firstName,
              lastName,
              gender,
              phoneNumber,
              email,
              _id,
              qualification,
              preBookingTime,
            },
            "Successfully logged in",
            res
          );
        } else {
          return successResponse(
            { message: "No Data found" },
            "Create a new profile",
            res,
            201
          );
        }
      }
      const otpData = await otpModel.findOne({
        phoneNumber: body.phoneNumber,
      });
      try {
        let data: any;
        // Abhi k liye OTP verification hata di hai
        // if (
        //   process.env.ENVIRONMENT !== "TEST" ||
        // )
        if (!["TEST", "PROD"].includes(process.env.ENVIRONMENT as string)) {
          data = await jwt.verify(otpData.otp, body.OTP);
          if (Date.now() > data.expiresIn)
            return errorResponse(new Error("OTP expired"), res);
        }

        if (
          body.OTP === data?.otp ||
          ["TEST", "PROD"].includes(process.env.ENVIRONMENT as string)
        ) {
          let profile = await doctorModel.findOne(
            {
              phoneNumber: body.phoneNumber,
              deleted: false,
              login: true,
            },
            {
              password: 0,
              // panCard: 0,
              // adhaarCard: 0,
              registrationDate: 0,
              DOB: 0,
              registration: 0,
              KYCDetails: 0,
            }
          );
          if (profile) {
            if (
              Object.keys(profile.toObject()).includes("verified") &&
              !profile.verified
            ) {
              return errorResponse(
                new Error("Your profile is under verification"),
                res,
                202
              );
            }
            const token = await jwt.sign(
              profile.toJSON(),
              process.env.SECRET_DOCTOR_KEY as string
            );
            otpData.remove();
            await profile.populate("qualification");
            profile = profile.toObject();
            profile.qualification = profile.qualification[0];
            const {
              firstName,
              lastName,
              gender,
              phoneNumber,
              email,
              _id,
              qualification,
              verified,
              preBookingTime,
            } = profile;
            doctorModel
              .findOneAndUpdate(
                {
                  phoneNumber: body.phoneNumber,
                  deleted: false,
                },
                {
                  $set: {
                    firebaseToken: body.firebaseToken,
                  },
                }
              )
              .then((result) => console.log("jhdsdsdsd", result));
            return successResponse(
              {
                token,
                firstName,
                lastName,
                gender,
                phoneNumber,
                email,
                _id,
                qualification,
                verified,
                preBookingTime,
              },
              "Successfully logged in",
              res
            );
          } else {
            otpData.remove();
            doctorModel.findOneAndUpdate(
              {
                phoneNumber: body.phoneNumber,
                deleted: false,
              },
              {
                firebaseToken: body.firebaseToken,
              }
            );
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
    let query: any = {
      _id: req.params.id,
      deleted: false,
      excludeDoctorFields,
    };
    let select: any = { ...excludeDoctorFields };
    if (req.body.fullDetails) {
      query = { _id: req.params.id, deleted: false };
      select = { password: 0 };
    }
    const doctorData = await doctorModel
      .findOne(query, select)
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
      .populate({
        path: "qualification",
        populate: {
          path: "qualificationName",
        },
      })
      .lean();

    console.log(":ldsvdsdsds", doctorData);

    if (doctorData) {
      doctorData.hospitalDetails = doctorData.hospitalDetails.map(
        (elem: any) => {
          return {
            _id: elem.hospital._id,
            name: elem.hospital.name,
            address: elem.hospital.address,
          };
        }
      );
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
    let deleteDate: Date = new Date();
    const doctorProfile = await doctorModel.findOneAndUpdate(
      { _id: req.currentDoctor, deleted: false },
      { $set: { deleted: true, deleteDate } }
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

    let { city, gender } = req.query;

    let matchQuery = {};
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
      doctorModel.aggregate([
        {
          $match: {
            $or: [
              { firstName: { $regex: term, $options: "i" } },
              { lastName: { $regex: term, $options: "i" } },
            ],
          },
        },
        {
          $project: {
            // specialization: 1,
            _id: 1,
          },
        },
        { $unwind: "$_id" },
      ]),
      specialityModel.aggregate([
        {
          $match: {
            specialityName: { $regex: term, $options: "i" },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]),
    ];

    Promise.all(promiseArray)
      .then(async (specialityArray: Array<any>) => {
        let formatArray = (arr: Array<any>) => {
          arr = (arr as Array<any>).flat();
          return _.map(arr, (e) =>
            e.speciality ? e.speciality.toString() : e._id.toString()
          );
        };

        let SA: Array<any> = Object.assign([], specialityArray);
        let id = specialityArray.splice(-1, 1);
        id = formatArray(id);
        SA = formatArray(SA);
        let doctorArray = await doctorModel
          .find(
            {
              $or: [
                {
                  active: true,
                  specialization: { $in: SA },
                  ...(gender && { gender }),
                },
                {
                  _id: { $in: id },
                },
              ],
            },
            {
              ...excludeDoctorFields,
              // "hospitalDetails.hospital": 0,
              // "hospitalDetails.workingHours": 0,
            }
          )
          .populate("specialization")
          .populate({ path: "qualification", select: { duration: 0 } })
          .populate({
            path: "hospitalDetails.hospital",
            populate: {
              path: "address",
              populate: { path: "city state locality country" },
            },
          })
          .lean();

        if (city) {
          doctorArray = doctorArray.filter((e: any) => {
            let data = e.hospitalDetails.filter((elem: any) => {
              return elem.hospital.address.city._id
                ? elem.hospital.address.city._id.toString() === city
                : false;
            });
            return data.length ? true : false;
          });
        }

        let arr: any = {};
        doctorArray.filter((e: any) => {
          e.hospitalDetails.filter((elem: any) => {
            arr[e._id.toString()] = [
              ...(arr[e._id.toString()] ?? []),
              elem?.hospital?._id.toString(),
            ];
          });
        });
        let presciprtionValidty = await prescriptionModel
          .find({
            doctorId: Object.keys(arr),
          })
          .lean();

        let d_in: any = [];
        doctorArray.forEach((e: any) => {
          e.hospitalDetails = e.hospitalDetails.map((elem: any) => {
            let data: any = presciprtionValidty.filter((elements: any) => {
              return (
                e?._id?.toString() === elements?.doctorId?.toString() &&
                elem?.hospital?._id.toString() ===
                elements?.hospitalId?.toString()
              );
            })[0];
            d_in = Object.assign({}, elem);
            d_in.hospital["prescriptionValidity"] = data ?? [];
            return d_in;
          });

          return e;
        });

        let data = doctorArray.map((e: any) => {
          return {
            _id: e._id,
            name: `${e.firstName} ${e.lastName}`,
            specilization: e?.specialization[0]?.specialityName,
            Qualification: e?.qualification[0]?.qualificationName?.abbreviation,
            experience: e?.overallExperience ?? null,
          };
        });

        // return successResponse(doctorArray, "Success", res);
        return successResponse(data, "Success", res);
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

    return successResponse({}, "Success", res);
    // return successResponse(Wh, "Success", res);
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
    const limit: number = 20;
    const skip: number = parseInt(req.params.page) * limit;
    const date: Date = req.body.date;
    let d = new Date(date);
    const { hospital_id } = req.body;
    // console.log("date", d);
    // let gtDate: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

    // let ltDate: Date = new Date(gtDate);
    // ltDate.setDate(gtDate.getDate() - 1);
    // ltDate.setUTCHours(24, 60, 60, 0);

    // gtDate.setDate(gtDate.getDate() + 1);
    // gtDate.setUTCHours(0, 0, 0, 0);

    let gtDate: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let ltDate: Date = new Date(gtDate);

    gtDate.setDate(gtDate.getDate() + 1);
    gtDate.setUTCHours(0, 0, 0, 0);

    let query: any = {
      doctors: req.currentDoctor,
      "time.date": {
        $gte: ltDate,
        $lte: gtDate,
      },
    };
    if (req.body.hospital) {
      query["hospital"] = req.body.hospital;
    }

    let appointments = await appointmentModel
      .find(query)
      .populate({ path: "patient", select: { password: 0, verified: 0 } })
      .populate({ path: "doctors", select: excludeDoctorFields })
      .populate({ path: "hospital" })
      .populate({ path: "subPatient" })
      .limit(limit)
      .skip(skip)
      .lean();

    appointments.forEach((appointment: any) => {
      appointment.patient["age"] = calculateAge(appointment.patient.DOB);
    });

    appointments = appointments.map((e: any) => {
      let time = e?.time;
      let subpatient = e?.subPatient;
      return {
        _id: e?.patient?._id,
        name: `${e?.patient?.firstName} ${e?.patient?.lastName}`,
        age: e?.patient?.age,
        gender: e?.patient?.gender,
        timing: `${time?.from?.time}:${time?.from?.division} to ${time?.till?.time}:${time?.till?.division}`,
        hospital: {
          _id: e?.hospital?._id,
          name: e?.hospital?.name,
        },
        subPatient: {
          ...(subpatient?.firstName && {
            _id: subpatient?._id,
            sub_pat_name:
              subpatient?.firstName &&
              `${subpatient?.firstName} ${subpatient?.lastName}`,
            sub_pat_age: calculateAge(subpatient?.DOB),
            sub_pat_gender: subpatient?.gender,
          }),
        },
        // subPatient: {
        //   _id: subpatient?._id,
        //   sub_pat_name: `${subpatient?.firstName} ${subpatient?.lastName}`,
        //   sub_pat_age: subpatient?.DOB,
        //   sub_pat_gender: subpatient?.gender,
        // },
      };
    });

    if (hospital_id) {
      appointments = appointments.filter(
        (e: any) => e?.hospital?._id?.toString() === hospital_id
      );
    }

    return successResponse({ patientdetails: appointments }, "Success", res);
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
      const updatedAppointment = await appointmentModel.findOne(
        { _id: body.appointmentId }
        // { $set: { cancelled: true } },
        // { new: true }
      );
      updatedAppointment.cancelled = true;
      await updatedAppointment.save();

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
    let { timings } = req.body,
      { id: doctorId } = req.params;
    let doctors = await hospitalService.hospitalsInDoctor(doctorId, timings);
    let doctordetails = {
      _id: doctors?._id,
      name: `${doctors.firstName} ${doctors.lastName}`,
      specilization: doctors?.specialization?.[0]?.specialityName,
      qualification: doctors?.qualification?.[0]?.qualificationName?.name,
      experience: doctors?.overallExperience,
    };

    let day: any = new Date(timings).getDay();

    let WEEK_DAYS = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    let hospitaldetails = doctors?.hospitalDetails.map((e: any) => {
      let data = e?.hospital;
      return {
        id: data?._id,
        name: data?.name,
        address: `${data?.address?.locality?.name}, ${data?.address?.city?.name}`,
        fee: e?.consultationFee?.min,
        prescription_validity: e?.prescription?.validateTill,
        time: e?.workingHours?.map((elem: any) => {
          return `${elem[WEEK_DAYS[day]]?.from.time}:${elem[WEEK_DAYS[day]]?.from.division
            } to ${elem[WEEK_DAYS[day]]?.till.time}:${elem[WEEK_DAYS[day]]?.till.division
            }`;
        }),

        capacityAndToken: e?.workingHours.map((elem: any) => {
          return {
            capacity: elem[WEEK_DAYS[day]].capacity,
            largestToken: elem[WEEK_DAYS[day]].appointmentsBooked,
          };
        }),
        available: e?.available,
        scheduleAvailable: e?.scheduleAvailable,
        lat: data?.lat,
        lng: data?.lng,
        contactNumber: data?.contactNumber
      };
    });

    return successResponse({ doctordetails, hospitaldetails }, "Successs", res);

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

    const selectedFields = {
      firstName: 1,
      lastName: 1,
      gender: 1,
      DOB: 1,
      KYCDetails: 0,
      specialization: 1,
      qualification: 1,
      totalExperience: 1,
    }

    let doctorObj;
    if (phone) {
      doctorObj = await doctorModel
        .findOne(
          {
            phoneNumber: term,
          },
          selectedFields
        )
        .populate("specialization qualification")
        .lean();
    } else if (email) {
      doctorObj = await doctorModel
        .findOne(
          {
            email: term,
          },
          selectedFields
        )
        .populate("qualification specialization")
        .lean();
    }

    if (doctorObj) {
      doctorObj["age"] = calculateAge(doctorObj["DOB"]);

      if (req.currentHospital) {
        let doctorExistInHospital = await hospitalModel.exists({
          _id: req.currentHospital,
          doctors: {
            $in: [doctorObj._id],
          },
        });

        if (doctorExistInHospital) {
          doctorObj["existInHospital"] = true;
        } else {
          doctorObj["existInHospital"] = false;
        }
      }
      return successResponse(doctorObj, "Success", res);
    }
    return successResponse({}, "No data found", res, 201);
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
      let hospitalDetails = doctorData.hospitalDetails.map((e: any) => {
        return e.hospital;
      });

      // "hospitalDetails":[

      //   {
      //   "id":"535435353",
      //   "name":"Tulsi hospital",
      //   }
      //   ]

      hospitalDetails = hospitalDetails.map((e: any) => {
        return {
          _id: e._id,
          name: e.name,
        };
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

export const checkDoctorAvailability = async (
  body: any
): Promise<{
  status: boolean;
  message: string;
}> => {
  const time = new Date(body.time.date);

  let d: any = time.getDay();
  let query: any = {
    doctorDetails: body.doctors,
    hospitalDetails: body.hospital,
  };
  if (d == 0) {
    d = "sunday";
    query["sunday.working"] = true;
    query["sunday.from.time"] = body.time.from.time;
    query["sunday.from.division"] = body.time.from.division;
    query["sunday.till.time"] = body.time.till.time;
    query["sunday.till.division"] = body.time.till.division;
  } else if (d == 1) {
    query["monday.working"] = true;
    query["monday.from.time"] = body.time.from.time;
    query["monday.from.division"] = body.time.from.division;
    query["monday.till.time"] = body.time.till.time;
    query["monday.till.division"] = body.time.till.division;
  } else if (d == 2) {
    query["tuesday.working"] = true;
    query["tuesday.from.time"] = body.time.from.time;
    query["tuesday.from.division"] = body.time.from.division;
    query["tuesday.till.time"] = body.time.till.time;
    query["tuesday.till.division"] = body.time.till.division;
  } else if (d == 3) {
    query["wednesday.working"] = true;
    query["wednesday.from.time"] = body.time.from.time;
    query["wednesday.from.division"] = body.time.from.division;
    query["wednesday.till.time"] = body.time.till.time;
    query["wednesday.till.division"] = body.time.till.division;
  } else if (d == 4) {
    query["thursday.working"] = true;
    query["thursday.from.time"] = body.time.from.time;
    query["thursday.from.division"] = body.time.from.division;
    query["thursday.till.time"] = body.time.till.time;
    query["thursday.till.division"] = body.time.till.division;
  } else if (d == 5) {
    query["friday.working"] = true;
    query["friday.from.time"] = body.time.from.time;
    query["friday.from.division"] = body.time.from.division;
    query["friday.till.time"] = body.time.till.time;
    query["friday.till.division"] = body.time.till.division;
  } else if (d == 6) {
    query["saturday.working"] = true;
    query["saturday.from.time"] = body.time.from.time;
    query["saturday.from.division"] = body.time.from.division;
    query["saturday.till.time"] = body.time.till.time;
    query["saturday.till.division"] = body.time.till.division;
  }
  // @TODO check if working hour exist first
  let capacity = await workingHourModel.findOne(query);
  if (!capacity) {
    let error: Error = new Error("Error");
    error.message = "Doctor not available";
    // return errorResponse(error, res);
    throw error;
  }

  body.time.date = new Date(body.time.date);
  // body.time.date = new Date(body.time.date);
  const requestDate: Date = new Date(body.time.date);
  const day = requestDate.getDay();
  if (day == 0) {
    capacity = capacity.sunday;
  } else if (day == 1) {
    capacity = capacity.monday;
  } else if (day == 2) {
    capacity = capacity.tuesday;
  } else if (day == 3) {
    capacity = capacity.wednesday;
  } else if (day == 4) {
    capacity = capacity.thursday;
  } else if (day == 5) {
    capacity = capacity.friday;
  } else if (day == 6) {
    capacity = capacity.saturday;
  }
  if (!capacity) {
    return {
      status: false,
      message: "Doctor not available on this day",
    };
  }
  let appointmentCount = await appointmentModel.find({
    doctors: body.doctors,
    hospital: body.hospital,
    "time.from.time": capacity.from.time,
    "time.till.time": capacity.till.time,
  });

  let appCount = 0;
  appointmentCount = appointmentCount.map((e: any) => {
    if (
      new Date(e.time.date).getDate() == new Date(requestDate).getDate() &&
      new Date(e.time.date).getFullYear() ==
      new Date(requestDate).getFullYear() &&
      new Date(e.time.date).getMonth() == new Date(requestDate).getMonth()
    ) {
      appCount++;
    }
  });

  if (appCount == capacity.capacity) {
    return {
      status: false,
      message: "Doctor cannot take any more appointments",
    };
  }

  return {
    status: true,
    message: "Doctor is available",
  };
};

export const getTotalEarnings = async (req: Request, res: Response) => {
  try {
    // const totalEarnings = await appointmentPaymentModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "orders",
    //       localField: "orderId",
    //       foreignField: "_id",
    //       as: "orderId",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$orderId",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "appointments",
    //       localField: "orderId.appointmentDetails",
    //       foreignField: "_id",
    //       as: "orderId.appointmentDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$orderId.appointmentDetails",
    //     },
    //   },
    //   {
    //     $match: {
    //       "orderId.appointmentDetails.doctors": new mongoose.Types.ObjectId(
    //         req.currentDoctor
    //       ),
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$orderId.appointmentDetails.doctors",
    //       totalEarnings: {
    //         $sum: "$orderId.amount",
    //       },
    //     },
    //   },
    // ]);

    const totalEarnings = await doctorService.getTotalEarnings(
      req.currentDoctor
    );
    return successResponse(totalEarnings, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getAvailableAmount = async (req: Request, res: Response) => {
  try {
    const totalEarnings = await doctorService.getTotalEarnings(
      req.currentDoctor
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getPendingAmount = async (req: Request, res: Response) => {
  try {
    const user = await doctorService.getUser(req);
    const pendingBalance = await doctorService.getPendingAmount(user);
    return successResponse(pendingBalance, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    let user: string = doctor;
    let id: string = req.currentDoctor
      ? req.currentDoctor
      : req.currentHospital;
    if (req.currentHospital) {
      user = hospital;
    }
    const body = req.body;
    const pendingAmount = await doctorService.getPendingAmount(id);
    if (body.withdrawalAmount > pendingAmount) {
      let error: Error = new Error("Insufficient Balance");
      error.name = "Not sufficient balance.";
      return errorResponse(error, res);
    } else {
      const receiptNumber = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const todayDate: Date = new Date();

      await new withdrawModel({
        withdrawalAmount: req.body.withdrawalAmount,
        withdrawnBy: id,
        user: user,
        withdrawalReceipt: `wthdrw_${receiptNumber}`,
        createdAt: todayDate,
      }).save();

      return successResponse(
        {
          withdrawalReceipt: `wthdrw_${receiptNumber}`,
          withdrawalAmount: req.body.withdrawalAmount,
          withdrawalDate: todayDate,
        },
        "Success",
        res
      );
    }
    // const Promise_TotalEarnings = doctorService.getTotalEarnings(req);

    // const [pendingAmount, totalEarnings] = Promise.all([
    //   Promise_PendingAmount,
    //   Promise_TotalEarnings,
    // ]);
  } catch (error: any) {
    let err = new Error(error);
    return errorResponse(err, res);
  }
};

export const getAppointmentSummary = async (req: Request, res: Response) => {
  try {
    let cancelledAppointments: any = appointmentModel
      .find({
        doctors: req.currentDoctor,
        cancelled: true,
      })
      .count();

    let doneAppointments: any = appointmentModel
      .find({
        doctors: req.currentDoctor,
        done: true,
      })
      .count();

    let totalAppointments: any = appointmentModel
      .find({
        doctors: req.currentDoctor,
      })
      .count();

    [cancelledAppointments, doneAppointments, totalAppointments] =
      await Promise.all([
        cancelledAppointments,
        doneAppointments,
        totalAppointments,
      ]);

    return successResponse(
      {
        cancelledAppointments,
        doneAppointments,
        totalAppointments,
      },
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const deleteSpecializationAndQualification = async (
  req: Request,
  res: Response
) => {
  try {
    const keys = ["specialization", "qualification"];
    let body = req.body;
    for (const key in body) {
      if (!keys.includes(key)) {
        let error = new Error(
          `${key} is not an acceptable key in the request body`
        );
        error.name = "Invalid request";
        throw error;
      }
    }
    if (body[Object.keys(body)[0]].length == 0) {
      throw new Error("Doctor must have at least on specialization");
    }
    let updateQuery = {
      $set: body,
    };
    const updatedDoctor = await doctorModel.findOneAndUpdate(
      {
        _id: req.currentDoctor,
      },
      updateQuery
    );

    if (!updatedDoctor) {
      throw new Error("Doctor does not exist");
    }
    return successResponse({}, "success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// verify payment ka issue

export const deleteHospitalFromDoctor = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    const doctor = await doctorModel.findOne({ _id: req.currentDoctor });
    const hospital = doctor.hospitalDetails.filter((e: any, index: number) => {
      // if (index == doctor.hospitalDetails.length - 1) {
      //   throw new Error("Doctor is not appointed in this hospital");
      // }
      return e.hospital != body.hospital;
    });
    // await doctor.save();
    await doctor.update({ $set: { hospitalDetails: hospital } });
    return successResponse(doctor, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const updateQualification = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let updateBody = {
      $set: body,
    };
    const qualification = await qualificationModel.findOneAndUpdate(
      {
        _id: req.params.qualificationId,
      },
      updateBody,
      {
        new: true,
      }
    );
    if (qualification) {
      return successResponse(qualification, "Success", res);
    }
    throw new Error("Qualification doesn't exist");
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const checkVerificationStatus = async (req: Request, res: Response) => {
  try {
    const doctorProfile = await doctorModel.findOne(
      {
        phoneNumber: req.body.phoneNumber,
        login: true,
        deleted: false,
      },
      {
        password: 0,
        registrationDate: 0,
        DOB: 0,
        registration: 0,
        KYCDetails: 0,
      }
    );

    if (!doctorProfile) {
      let error: Error = new Error("Profile doesn't exist");
      error.name = "Not Found";
      throw error;
    }

    if (!doctorProfile.verified) {
      let error: Error = new Error("Your profile is under verification");
      error.name = "Unverified Profile";
      throw error;
    }

    await doctorProfile.populate("qualification");
    let {
      firstName,
      lastName,
      gender,
      phoneNumber,
      email,
      _id,
      qualification,
    } = doctorProfile.toJSON();
    qualification = qualification[0];

    let token = await doctorService.getDoctorToken(doctorProfile.toJSON());
    return successResponse(
      {
        token,
        firstName,
        lastName,
        gender,
        phoneNumber,
        email,
        _id,
        qualification,
      },
      "Your profile is verified",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

/* Hospital khud ko doctor ki profile me add kr ske */
export const addHospitalInDoctorProfile = async (
  req: Request,
  res: Response
) => {
  try {
    let { doctorId, ...rest } = req.body;
    let keys = Object.keys(rest);
    if (
      !(
        keys.includes("hospital") &&
        keys.includes("workingHours") &&
        keys.includes("consultationFee")
      )
    ) {
      return errorResponse(
        new Error("Incorrent or improper number of values in request body"),
        res,
        402
      );
    }

    let all_workingHours = (
      await workingHourModel.find(
        { doctorDetails: doctorId, hospitalDetails: req.currentHospital },
        { _id: 1 }
      )
    ).map((e) => e._id.toString());

    if (!all_workingHours.includes(rest.workingHours)) {
      return errorResponse(
        new Error(
          "The working hour you've sent does not belong to this doctor and hospital"
        ),
        res,
        402
      );
    }
    let doctor = await doctorModel.findOneAndUpdate(
      {
        _id: doctorId,
      },
      {
        $addToSet: {
          hospitalDetails: [
            {
              hospital: rest.hospital,
              consultationFee: rest.consultationFee,
            },
          ],
        },
      }
    );

    if (doctor) {
      return successResponse({}, "Successfully updated profile", res);
    } else {
      return errorResponse(new Error("Doctor doesn't exist"), res, 404);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const setConsultationFeeForDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    let response = await doctorService.setConsultationFeeForDoctor(
      req.currentDoctor ? req.currentDoctor : req.body.doctorId,
      req.body.hospitalId,
      req.body.consultationFee
    );
    return successResponse({}, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getListOfRequestedApprovals_OfDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    let doctorId = req.currentDoctor;
    let data = await approvalService.getListOfRequestedApprovals_OfDoctor(
      doctorId
    );
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const getListOfRequestedApprovals_ByDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    let doctorId = req.currentDoctor;
    let data = await approvalService.getListOfRequestedApprovals_ByDoctor(
      doctorId
    );
    let data2 = await approvalService.getListOfRequestedApprovals_OfDoctor(
      doctorId
    );
    let response = [...data, ...data2];
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorsOfflineAndOnlineAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    let appointments =
      await doctorService.getDoctorsOfflineAndOnlineAppointments(
        req.currentDoctor
      );
    return successResponse(appointments, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

import * as notificationService from "../Services/Notification/Notification.Service";
import prescriptionModel from "../Models/Prescription.Model";
import addressModel from "../Models/Address.Model";
import {
  digiMilesSMS,
  getRangeOfDates,
  sendOTPForPasswordChange,
  verifyPasswordChangeOTP,
} from "../Services/Utils";
import suvedhaModel from "../Models/Suvedha.Model";
import patientModel from "../Models/Patient.Model";
import holidayModel from "../Models/Holiday-Calendar.Model";
import { offDatesAndDays, UserType, Weekdays } from "../Services/Helpers";

export const getDoctorsNotification = async (req: Request, res: Response) => {
  try {
    /* Notification jaha pe sender hospital hai */
    let notifications_whereSenderIsHospital =
      notificationService.getDoctorsNotification_whenSenderIsHospital_approvalRequest(
        req.currentDoctor
      );

    /* Notification jaha pe sender patient hai */
    let notifications_whereSenderIsPatient =
      notificationService.getDoctorsNotification_whenSenderIsPatient(
        req.currentDoctor
      );

    Promise.all([
      notifications_whereSenderIsHospital,
      notifications_whereSenderIsPatient,
    ])
      .then((result: Array<any>) => {
        console.log(":lknjbhjgvh bfdfdf", result);
        let notifications = result.map((e: any) => e[0]);
        notifications = notifications.sort(
          (a: any, b: any) => a.createdAt - b.createdAt
        );

        notifications = notifications.filter((e: any) => e);
        return successResponse(notifications, "Success", res);
      })
      .catch((error: any) => errorResponse(error, res));
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

/* Holiday calendar */
export const setHolidayCalendar = async (req: Request, res: Response) => {
  try {
    let holiday = await holidayService.addHolidayCalendar({
      doctorId: req.body.doctorId,
      hospitalId: req.body.hospitalId,
      date: req.body.date,
    });
    return successResponse(holiday, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorsHolidayList = async (req: Request, res: Response) => {
  try {
    let doctorId: string = "",
      hospitalId = req.body.hospitalId;
    if (req.currentDoctor) {
      doctorId = req.currentDoctor;
    } else {
      doctorId = req.body.doctorId;
    }

    let { year, month } = req.body;
    let holidayList = await holidayService.getDoctorsHolidayList(
      doctorId,
      year,
      month,
      hospitalId
    );
    return successResponse(holidayList, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const deleteHolidayCalendar = async (req: Request, res: Response) => {
  try {
    await holidayService.deleteHolidayCalendar(req.body.holidayId);
    return successResponse({}, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getHospitalsOfflineAndOnlineAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    let appointments =
      await hospitalService.getHospitalsOfflineAndOnlineAppointments(
        req.query.hospitalId as string,
        req.body.date
      );

    return successResponse(appointments, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const getListOfAllAppointments = async (req: Request, res: Response) => {
  try {
    let appointment = await doctorService.getListOfAllAppointments(
      req.currentDoctor,
      req.params.page
    );
    return successResponse(appointment, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getAppointmentFeeFromAppointmentId = async (
  req: Request,
  res: Response
) => {
  try {
    return successResponse(
      await doctorService.getAppointmentFeeFromAppointmentId(
        req.params.appointmentId
      ),
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getPrescriptionValidityAndFeesOfDoctorInHospital = async (
  req: Request,
  res: Response
) => {
  try {
    let doctorId;
    let hospitalId = req.body.hospitalId;
    if (req.currentDoctor) {
      doctorId = req.currentDoctor;
    } else {
      doctorId = req.body.doctorId;
    }
    let data =
      await prescriptionController.getPrescriptionValidityAndFeesOfDoctorInHospital(
        hospitalId,
        doctorId
      );
    let [p, c] = data;

    return successResponse({ ...p, ...c }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const likeADoctor = async (req: Request, res: Response) => {
  try {
    let { likedDoctorId, likedById } = req.body;
    console.log("bvdsds dsdds", req.currentHospital);
    console.log("dsdsdsdssd", req.currentSuvedha);
    let hospitalExist = await hospitalService.doesHospitalExist(likedById);
    let reference;
    if (hospitalExist) {
      reference = hospital;
    }
    if (req.currentSuvedha) {
      reference = suvedha;
    }
    let likedDoctor = await doctorService.likeDoctor(
      likedDoctorId,
      likedById,
      reference
    );
    return successResponse(likedDoctor, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const unlikeDoctor = async (req: Request, res: Response) => {
  try {
    let { likedDoctorId, likedById } = req.body;
    let hospitalExist = await hospitalService.doesHospitalExist(likedById);
    let reference;
    if (hospitalExist) {
      reference = hospital;
    }
    let unlikeDoctor = await doctorService.unlikeDoctor(
      likedDoctorId,
      likedById,
      reference
    );
    return successResponse(unlikeDoctor, "Success", res);
  } catch (error: any) {
    return errorResponse(new Error(error), res);
  }
};
export const getMyLikes = async (req: Request, res: Response) => {
  try {
    let { doctorId } = req.currentDoctor;
    if (!doctorId) {
      doctorId = req.body.doctorId;
    }
    let likes = await doctorService.getMyLikes(doctorId);
    return successResponse(likes, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getSpecializationByCity = async (req: Request, res: Response) => {
  try {
    let { cityId } = req.query;

    let hospitals = await getHospitalsInACity(cityId as string);

    hospitals = hospitals.map((e: any) => {
      return {
        _id: e._id.toString(),
      };
    });
    let docsInHospitals = await doctorService.getDoctorsInHospitalByQuery(
      {
        _id: { $in: hospitals },
        $expr: { $gt: [{ $size: "$doctors" }, 0] },
      },
      {
        doctors: 1,
      }
    );

    let specality = docsInHospitals
      .map((hospital: any) => {
        return hospital.doctors.map((docs: any) => docs.specialization).flat();
      })
      .flat();

    // const Conn = mongoose.createConnection();
    // await Conn.openUri(<string>process.env.DB_PATH);

    // const special = Conn.collection("special").find({
    //   _id: { $in: specality.flat() },
    // });

    const special = specialityModel.find({ _id: { $in: specality.flat() } });

    let SBD = await Promise.all([special]);
    let [S] = SBD;

    // Conn.close();

    return successResponse({ Speciality: S }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const sendOTPToUpdateNumber = async (req: Request, res: Response) => {
  try {
    sendOTPForPasswordChange(req.body.phoneNumber);
    return successResponse({}, "OTP send successfully", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const verifyOTPToUpdateNumber = async (req: Request, res: Response) => {
  try {
    let { phoneNumber, OTP, newPhoneNumber } = req.body;
    if (!newPhoneNumber) {
      throw new Error("Enter new phone number");
    }

    let result = true;
    if (!["TEST"].includes(process.env.ENVIRONMENT as string)) {
      result = await verifyPasswordChangeOTP(newPhoneNumber, OTP);
    }

    // let result = await verifyPasswordChangeOTP(newPhoneNumber, OTP);
    if (result) {
      let exist = await doctorModel.exists({
        phoneNumber: newPhoneNumber,
      });

      let existHospital = hospitalModel.exists({
        contactNumber: newPhoneNumber,
      });

      let existSuvedha = suvedhaModel.exists({ phoneNumber: newPhoneNumber });

      let existPatient = patientModel.exists({ phoneNumber: newPhoneNumber });

      let existResult = await Promise.all([
        exist,
        existHospital,
        existSuvedha,
        existPatient,
      ]);

      // if (exist) {
      if (existResult.includes(true)) {
        throw new Error("Phone number already exist");
      }

      let userData = await doctorModel.findOne({ phoneNumber });
      doctorModel
        .findOneAndUpdate(
          {
            _id: userData._id,
          },
          {
            $set: {
              phoneNumber: newPhoneNumber,
              phoneNumberUpdate: true,
            },
          }
        )
        .then((res) => console.log("resss", res));
      return successResponse({}, "Success", res);
    } else {
      throw new Error("Invalid OTP");
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const deleteDoctorQualification = async (
  req: Request,
  res: Response
) => {
  try {
    let { qualificationId } = req.body;

    doctorModel
      .findOneAndUpdate(
        {
          _id: req.currentDoctor,
        },
        {
          $pull: { qualification: qualificationId },
        }
      )
      .then((result: any) => {
        console.log("jgdshbds sdds", result);
      });
    return successResponse({}, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorQualificationList = async (
  req: Request,
  res: Response
) => {
  try {
    let doctor = await doctorModel
      .findOne({ _id: req.currentDoctor })
      .populate("qualification");

    let { qualification } = doctor;

    qualification = qualification.map((e: any) => ({
      id: e._id,
      name: e.qualificationName.abbreviation,
      certificationorgnisation: e.certificationOrganisation,
    }));
    return successResponse(qualification, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};


export const getDoctorsAllHolidayList = async (req: Request, res: Response) => {
  try {
    const doctorId = req.body.doctorId;
    const hospitalId = req.body.hospitalId;

    let [startDate, endDate] = [req.body.startDate, req.body.endDate]


    let workingDaysPromise = workingHourModel.find({ doctorDetails: doctorId, hospitalDetails: hospitalId }).lean()
    let holidaysPromise = holidayModel.find({ doctorId, hospitalId, date: { $gte: startDate, $lte: endDate } }).lean()

    let [workingDaysArray, holidays] = await Promise.all([workingDaysPromise, holidaysPromise]);

    let offDays: offDatesAndDays, holidayDates: Array<string> = []

    offDays = doctorService.getDoctorsOffDaysForADateRange(workingDaysArray, startDate, endDate)
    holidayDates = holidays.map((e: any) => e?.date)

    return successResponse({ ...offDays, holidayDates }, "Success", res)
  } catch (error: any) {
    return errorResponse(error, res)
  }
}

export const setThatDoctorTakesOverTheCounterPayments = async (req: Request, res: Response) => {
  try {
    const { doctorId, hospitalId } = req.body
    if (!(doctorId && hospitalId)) {
      const error = new Error("Invalid doctor or hospital")
      throw error
    }
    const createdBy = req.currentDoctor ? UserType.DOCTOR : UserType.HOSPITAL;

    await doctorService.setThatDoctorTakesOverTheCounterPayments(doctorId, hospitalId, createdBy)
    return successResponse({}, "Success", res)
  } catch (error: any) {
    return errorResponse(error, res)
  }
}

export const deleteThatDoctorTakesOverTheCounterPayments = async (req: Request, res: Response) => {
  try {
    const { doctorId, hospitalId } = req.query
    if (!(doctorId && hospitalId)) {
      const error = new Error("Invalid doctor or hospital")
      throw error
    }
    
    await doctorService.deleteThatDoctorTakesOverTheCounterPayments(doctorId as string, hospitalId as string)
    return successResponse({}, "Success", res)
  } catch (error: any) {
    return errorResponse(error, res)
  }
}

export const checkIfDoctorTakesOverTheCounterPaymentsForAHospital = async (req: Request, res: Response) => {
  try {
    const { doctorId, hospitalId } = req.query
    if (!(doctorId && hospitalId)) {
      const error = new Error("Invalid doctor or hospital")
      throw error
    }

    const exist = await doctorService.checkIfDoctorTakesOverTheCounterPaymentsForAHospital(doctorId as string, hospitalId as string)
    return successResponse(exist, "Success", res)
  } catch (error: any) {
    return errorResponse(error, res)
  }
}

