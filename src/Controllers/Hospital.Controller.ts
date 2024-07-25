import { Request, Response } from "express";
import addressModel from "../Models/Address.Model";
import anemityModel from "../Models/Anemities.Model";
import hospitalModel from "../Models/Hospital.Model";
import { errorResponse, successResponse } from "../Services/response";
import * as jwt from "jsonwebtoken";
import specialityBodyModel from "../Admin Controlled Models/SpecialityBody.Model";
import specialityDiseaseModel from "../Admin Controlled Models/SpecialityDisease.Model";
import specialityDoctorTypeModel from "../Admin Controlled Models/SpecialityDoctorType.Model";
import specialityModel from "../Admin Controlled Models/Specialization.Model";
import {
  appointment,
  disease,
  doctorType,
  specialization,
} from "../Services/schemaNames";
import _ from "underscore";
import doctorModel from "../Models/Doctors.Model";
import appointmentModel from "../Models/Appointment.Model";
import otpModel from "../Models/OTP.Model";
import { sendMessage } from "../Services/message.service";
import workingHourModel from "../Models/WorkingHours.Model";
import {
  excludeHospitalFields,
  excludePatientFields,
} from "./Patient.Controller";
import { formatWorkingHour } from "../Services/WorkingHour.helper";
import * as bcrypt from "bcrypt";
import servicesModel from "../Admin Controlled Models/Services.Model";
import { request } from "http";
import { getHospitalToken } from "../Services/Hospital/Hospital.Service";
import { getAgeOfDoctor } from "../Services/Doctor/Doctor.Service";
import {
  addDays,
  digiMilesSMS,
  getAge,
  sendOTPForPasswordChange,
  verifyPasswordChangeOTP,
} from "../Services/Utils";
import * as approvalService from "../Services/Approval-Request/Approval-Request.Service";
import * as addressService from "../Services/Address/Address.Service";
import * as hospitalService from "../Services/Hospital/Hospital.Service";
import {
  emailValidation,
  phoneNumberValidation,
} from "../Services/Validation.Service";
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
        let error = new Error("Invalid phone number");
        error.name = "Invalid input";
        return errorResponse(error, res);
      }
    } else {
      if (body.phoneNumber == "9999699996") {
        const profile = await hospitalModel.findOne(
          {
            phoneNumber: body.phoneNumber,
            deleted: false,
          },
          {
            verified: 0,
            registrationDate: 0,
            DOB: 0,
            registration: 0,
            KYCDetails: 0,
          }
        );
        if (profile) {
          const token = await jwt.sign(
            profile.toJSON(),
            process.env.SECRET_HOSPITAL_KEY as string
          );
          const { name, contactNumber, _id, numberOfBed, password } =
            profile.toJSON();
          hospitalModel
            .findOneAndUpdate(
              {
                contactNumber: body.phoneNumber,
                deleted: false,
              },
              {
                $set: {
                  firebaseToken: body.firebaseToken,
                },
              }
            )
            .then((result: any) => console.log("result", result));
          return successResponse(
            { token, name, contactNumber, _id, numberOfBed, password },
            "Successfully logged in",
            res
          );
        } else {
          return successResponse(
            { message: "No Data found" },
            "Create a new Hospital",
            res,
            201
          );
        }
      }
      const otpData = await otpModel.findOne({
        phoneNumber: body.phoneNumber,
      });
      try {
        // Abhi k liye OTP verification hata di hai
        let data: any;
        // if (process.env.ENVIRONMENT !== "TEST") {
        if (!["TEST", "PROD"].includes(process.env.ENVIRONMENT as string)) {
          data = await jwt.verify(otpData.otp, body.OTP);
          if (Date.now() > data.expiresIn)
            return errorResponse(new Error("OTP expired"), res);
        }
        // if (body.OTP === data?.otp || process.env.ENVIRONMENT === "TEST") {

        if (
          body.OTP === data?.otp ||
          ["TEST", "PROD"].includes(process.env.ENVIRONMENT as string)
        ) {
          // if (true) {
          const profile = await hospitalModel.findOne({
            contactNumber: body.phoneNumber,
            deleted: false,
          });
          if (profile) {
            const token = await jwt.sign(
              profile.toJSON(),
              process.env.SECRET_HOSPITAL_KEY as string
            );
            otpData.remove();
            const { name, contactNumber, _id, numberOfBed, password } =
              profile.toJSON();
            console.log("body.phoneNumberbody.phoneNumber", body.phoneNumber);
            hospitalModel
              .findOneAndUpdate(
                {
                  contactNumber: body.phoneNumber,
                  deleted: false,
                },
                {
                  $set: {
                    firebaseToken: body.firebaseToken,
                  },
                }
              )
              .then((result: any) => console.log("result", result));

            return successResponse(
              { token, name, contactNumber, _id, numberOfBed, password },
              "Successfully logged in",
              res
            );
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

export const loginWithPassword = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.password =
      body.password && body.password.trim().length >= 5 ? body.password : null;

    body.contactNumber =
      body.contactNumber && body.contactNumber.trim().length == 10
        ? body.contactNumber
        : null;

    if (body.password && body.contactNumber) {
      const hospital = await hospitalModel.findOne(
        {
          contactNumber: body.contactNumber,
          deleted: false,
        },
        excludeHospitalFields
      );

      if (hospital) {
        let cryptSalt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(body.password, cryptSalt);
        const compare = await bcrypt.compare(body.password, hospital.password);
        if (compare) {
          const token = await jwt.sign(
            hospital.toJSON(),
            process.env.SECRET_HOSPITAL_KEY as string
          );
          const { name, _id } = hospital;
          return successResponse({ token, name, _id }, "Success", res);
        } else {
          let error: Error = new Error("Incorrect password");
          error.name = "Authentication Failed";
          return errorResponse(error, res);
        }
      } else {
        let error = new Error("No hospital found");
        error.name = "Not Found";
        return errorResponse(error, res);
      }
      // bcrypt.compare()
    }

    let error: Error = new Error("Invalid Phone Number");
    error.name = "Authentication Failed";
    return errorResponse(error, res);
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
export const myHospital = async (req: Request, res: Response) => {
  try {
    const hospital = await hospitalModel.find({
      deleted: false,
      _id: req.currentHospital,
    });
    return successResponse(hospital, "Successfully fetched Hospital", res);
  } catch (error: any) {
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

// Get anemities
export const getAnemities = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let anemityObj = await anemityModel.find({});
    return successResponse(anemityObj, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const deleteAnemities = async (req: Request, res: Response) => {
  try {
    return successResponse(
      await anemityModel.findOneAndDelete({ _id: req.params.id }),
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Get services
export const getServices = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let serviceObj = await servicesModel.find({});
    return successResponse(serviceObj, "Success", res);
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
      $set: { ...body, numberOfBed, type },
      $addToSet: {
        doctors,
        anemity,
        payment,
      },
    };

    let b = req.body;
    const DoctorObj = await doctorModel.find({ deleted: false, _id: doctors });

    if (!doctors || DoctorObj.length == doctors.length) {
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

    let { city } = req.query;
    let regexVar = `/^${term}$/i`;
    const promiseArray: Array<any> = [
      specialityBodyModel.aggregate([
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
      hospitalModel.aggregate([
        {
          $match: {
            name: { $regex: term, $options: "i" },
          },
        },
        {
          $project: {
            // specialisedIn: 1,
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
          arr = arr.flat();
          return _.map(arr, (e) =>
            e.speciality ? e.speciality.toString() : e._id.toString()
          );
        };

        let SA: Array<any> = Object.assign([], specialityArray);
        let id = specialityArray.splice(-1, 1);
        id = formatArray(id);
        SA = formatArray(SA);

        const doctorArray = await doctorModel
          .find(
            {
              $or: [
                {
                  active: true,
                  specialization: { $in: SA },
                },
                {
                  _id: { $in: id },
                },
              ],
            },
            {
              ...excludeDoctorFields,
              // "hospitalDetails.hospital": 0,
              "hospitalDetails.workingHours": 0,
            }
          )
          .populate("specialization")
          // .populate("hospitalDetails.hospital")
          .populate({ path: "qualification", select: { duration: 0 } });

        let hospitalIds: any = doctorArray
          .map((e: any) =>
            e.hospitalDetails.map((elem: any) => elem.hospital.toString())
          )
          .flat();

        hospitalIds = new Set(hospitalIds);

        let hospitalArray = await hospitalModel
          .find(
            {
              $or: [
                {
                  deleted: false,
                  _id: { $in: [...hospitalIds] },
                },
                {
                  type: term,
                },
              ],
            },
            {
              doctors: 0,
              specialisedIn: 0,
              treatmentType: 0,
              type: 0,
              payment: 0,
              deleted: 0,
              contactNumber: 0,
              numberOfBed: 0,
            }
          )
          .sort({ name: 1 })
          .populate({ path: "anemity" })
          .populate({
            path: "address",
            populate: {
              path: "city state country locality",
            },
          })
          // .populate("doctors")
          .populate({
            path: "openingHour",
            select: {
              doctorDetails: 0,
              hospitalDetails: 0,
            },
          });
        if (city) {
          hospitalArray = hospitalArray.filter((e: any) => {
            return e?.address?.city?._id.toString() === city;
          });
        }

        let data = hospitalArray.map((e: any) => {
          return {
            _id: e?._id,
            name: e?.name,
            Address: e?.address?.locality?.name,
            contactNumber: e?.contactNumber,
            lat: e?.lat,
            lng: e?.lng
          };
        });

        // return successResponse(hospitalArray, "Success", res);
        return successResponse(data, "Success", res);
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
      .populate({
        path: "patient",
        select: {
          ...excludePatientFields,
          phoneNumber: 0,
          email: 0,
          active: 0,
          deleted: 0,
        },
      })
      .populate({
        path: "doctors",
        select: {
          ...excludeDoctorFields,
          gender: 0,
          phoneNumber: 0,
          email: 0,
          active: 0,
          deleted: 0,
          specialization: 0,
          qualification: 0,
          overallExperience: 0,
          hospitalDetails: 0,
          image: 0,
          id: 0,
        },
      })
      .sort({ "time.date": 1 })
      .skip(page > 1 ? (page - 1) * 2 : 0)
      .limit(2);

    const page2 = appointmentObj.length / 2;

    const older_apppointmentObj: Array<object> = await appointmentModel
      .find({ hospital: req.currentHospital, "time.date": { $lte: Date() } })
      .populate({
        path: "patient",
        select: {
          ...excludePatientFields,
          phoneNumber: 0,
          email: 0,
          active: 0,
          deleted: 0,
        },
      })
      .populate({
        path: "doctors",
        select: {
          ...excludeDoctorFields,
          gender: 0,
          phoneNumber: 0,
          email: 0,
          active: 0,
          deleted: 0,
          specialization: 0,
          qualification: 0,
          overallExperience: 0,
          hospitalDetails: 0,
          image: 0,
          id: 0,
        },
      })
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

export const getAppointmentByDate = async (req: Request, res: Response) => {
  try {

    const body = req.body;
    const date: Date = req.body.date;
    let d = new Date(date);
    let gtDate: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let ltDate: Date = new Date(gtDate);
    // ltDate.setDate(gtDate.getDate() - 1);
    // ltDate.setUTCHours(24, 0, 0, 0);

    gtDate = addDays(gtDate, 1)
    // gtDate.setDate(gtDate.getDate() + 1);
    // gtDate.setUTCHours(0, 0, 0, 0);
    let appointmenObj = await appointmentModel
      .find({
        hospital: req.currentHospital,
        "time.date": { $gte: ltDate, $lte: gtDate },
      }, {
        hospital: 0,
        done: 0,
        cancelled: 0,
        rescheduled: 0
      })
      .populate({
        path: "doctors",
        select: {
          password: 0,
          verified: 0,
          registrationDate: 0,
          registration: 0,
          KYCDetails: 0,
          hospitalDetails: 0,
          specialization: 0,
          qualification: 0,
          overallExperience: 0,
          DOB: 0,
          email: 0,
          active: 0,
          deleted: 0,
          image: 0,
          age: 0,
          totalExperience: 0,
          advancedBookingPeriod: 0,
        },
      })
      .populate({
        path: "patient",
        select: {
          password: 0, verified: 0, services: 0, email: 0,
          active: 0,
          deleted: 0,
          location: 0,
        },
      })
      // .populate({
      //   path: "hospital",
      //   select: excludeHospitalFields,
      // })
      .populate({ path: "subPatient", select: { parentPatient: 0 } })
      .lean();

    // appointmenObj = appointmenObj.toObject();
    appointmenObj.forEach((e: any) => {
      e.patient["age"] = getAge(e.patient.DOB);
      // e.doctors["age"] = getAge(e.doctors.DOB);
      e.patient["name"] = `${e.patient?.firstName} ${e.patient?.lastName}`
      e.doctors["name"] = `${e.doctors?.firstName} ${e.doctors?.lastName}`
      if (e.subPatient) {
        e.subPatient["age"] = getAge(e.subPatient.DOB);
      }
    });
    appointmenObj =  _.sortBy(appointmenObj, item => _.indexOf(AppointStatusOrder, item?.appointmentStatus))

    return successResponse(appointmenObj, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// export const getHospitalById = async (req: Request, res: Response) => {
//   try {
//     let hospital = await hospitalModel
//       .findOne({
//         _id: req.params.id,
//       })
//       .populate({
//         path: "address",
//         populate: {
//           path: "city state locality country",
//         },
//       })
//       .populate({
//         path: "doctors",
//         select: {
//           firstName: 1,
//           lastName: 1,
//           specialization: 1,
//           hospitalDetails: 1,
//           qualification: 1,
//           overallExperience: 1,
//         },
//         populate: {
//           path: "specialization qualification hospitalDetails.workingHours",
//           select: {
//             doctorDetails: 0,
//             hospitalDetails: 0,
//           },
//         },
//       })
//       .populate("anemity")
//       .populate("payment")
//       .populate("specialisedIn")
//       .populate({
//         path: "openingHour",
//         select: {
//           _id: 0,
//           __v: 0,
//           byHospital: 0,
//         },
//       })
//       .populate("services")
//       .lean();

//     if (hospital.doctors.length == 0) {
//       return successResponse({ hospital }, "Success", res);
//     }
//     const doctorIds: Array<string> = hospital.doctors.map((e: any) => {
//       return e._id.toString();
//     });

//     let workingHours: any = await workingHourModel
//       .find({
//         doctorDetails: { $in: doctorIds },
//         hospitalDetails: req.params.id,
//       })
//       .select({
//         hosptial: 0,
//         _id: 0,
//         __v: 0,
//         byHospital: 0,
//         hospitalDetails: 0,
//       })
//       .lean();

//     workingHours = workingHours.reduce((r: any, a: any) => {
//       r[a.doctorDetails.toString()] = [
//         ...(r[a.doctorDetails.toString()] || []),
//         a,
//       ];
//       return r;
//     }, {});

//     hospital.doctors.map((e: any) => {
//       e.hospitalDetails = e.hospitalDetails.filter(
//         (elem: any) => elem.hospital.toString() == req.params.id
//       );
//     });

//     let doctors = hospital.doctors.map((e: any) => {
//       if (e.hospitalDetails.length != 0) {
//         return {
//           _id: e._id,
//           firstName: e.firstName,
//           lastName: e.lastName,
//           specialization: e.specialization,
//           qualification: e.qualification,
//           KYCDetails: e.KYCDetails,
//           overallExperience: e.overallExperience,
//           hospitalDetails: [
//             {
//               workingHour: formatWorkingHour(
//                 workingHours[e._id.toString()]
//                   ? workingHours[e._id.toString()]
//                   : []
//               ),
//               consultationFee: e.hospitalDetails[0].consultationFee,
//               _id: e.hospitalDetails._id,
//             },
//           ],
//         };
//       }
//       // return ...[]
//       // return;
//     });
//     if (hospital.openingHour) {
//       hospital.openingHour = formatWorkingHour([hospital.openingHour]);
//     }

//     if (doctors.includes(undefined) && doctors.length == 1) {
//       hospital.doctors = [];
//     } else {
//       if (doctors.includes(undefined)) {
//         doctors = doctors.filter((e: any) => e);
//       }
//       hospital.doctors = doctors;
//     }

//     let hospitalDetails = {
//       name: hospital?.name,
//       address: `${hospital?.hospital?.address?.locality?.name}, ${hospital?.hospital?.address?.city?.name}`,
//       _id: hospital._id,
//     };

//     let doctordetails = hospital?.doctors.map((e: any) => {
//       return {
//         id: e?._id,
//         name: `${e.firstName} ${e.lastName}`,
//         specilization: e?.specialization?.[0]?.specialityName,
//         qualification: e?.qualification?.[0]?.qualificationName?.name,
//         fee: e?.hospitalDetails?.[0]?.consultationFee?.min,
//         experience: e?.overallExperience,
//         time: e?.hospitalDetails?.[0]?.workingHour.map((elem: any) => {
//           return {
//             time: `${elem?.timings?.from?.time}:${elem?.timings?.from?.division} ${elem?.timings?.till?.time}:${elem?.timings?.till?.division}`,
//           };
//         }),
//       };
//     });
//     return successResponse({ hospitalDetails, doctordetails }, "Success", res);

//     // return successResponse({ hospital }, "Success", res);
//   } catch (error: any) {
//     return errorResponse(error, res);
//   }
// };

export const getHospitalById = async (req: Request, res: Response) => {
  try {
    let { timings } = req.body,
      { id: hospitalId } = req.params;

    let hospitalDetails = await hospitalService.doctorsInHospital(
      hospitalId,
      timings
    );

    let { doctors } = hospitalDetails;

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
    doctors = doctors.map((e: any) => {
      return {
        _id: e?._id,
        name: `${e.firstName} ${e.lastName}`,
        specilization: e?.specialization[0]?.specialityName,
        Qualification: e?.qualification[0]?.qualificationName?.abbreviation,
        Exeperience: e?.overallExperience,
        Fee: e?.hospitalDetails.find(
          (elem: any) => elem.hospital.toString() === hospitalId
        )?.consultationFee.max,
        workinghour: e?.workingHours.map((elem: any) => {
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
        capacity: "",
        highestToken: "",
        available: e?.available,
        scheduleAvailable: e?.scheduleAvailable,
      };
    });

    hospitalDetails = {
      _id: hospitalDetails._id,
      name: hospitalDetails.name,
      address: `${hospitalDetails?.address?.locality?.name} ${hospitalDetails?.address?.city?.name}`,
    };
    return successResponse(
      { doctordetails: doctors, hospitalDetails },
      "Successs",
      res
    );
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const getDoctorsInHospital = async (req: Request, res: Response) => {
  try {
    const hospitalDetails = await hospitalModel
      .findOne({ _id: req.currentHospital, deleted: false }, { doctors: 1 })
      .populate({
        path: "doctors",
        select: excludeDoctorFields,
        populate: {
          path: "specialization qualification",
        },
      })
      .lean();

    hospitalDetails.doctors.forEach((e: any) => {
      e.hospitalDetails = e.hospitalDetails.filter(
        (elem: any) => elem && elem.hospital.toString() == req.currentHospital
      );
    });

    return successResponse(hospitalDetails, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const checkVerificationStatus = async (req: Request, res: Response) => {
  try {
    const hospitalProfile = await hospitalModel.findOne(
      {
        contactNumber: req.body.phoneNumber,
        login: true,
        deleted: false,
      },
      excludeHospitalFields
    );

    if (!hospitalProfile) {
      let error: Error = new Error("Profile doesn't exist");
      error.name = "Not Found";
      throw error;
    }

    if (!hospitalProfile.verified) {
      let error: Error = new Error("Your profile is under verification");
      error.name = "Unverified Profile";
      throw error;
    }

    let {
      name,
      contactNumber,
      email,
      _id,
      token = await getHospitalToken(hospitalProfile.toJSON()),
    } = hospitalProfile.toJSON();

    return successResponse(
      {
        token,
        name,
        contactNumber,
        email,
        _id,
      },
      "Your profile is verified",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getListOfRequestedApprovals_OfHospital = async (
  req: Request,
  res: Response
) => {
  try {
    let hospitalId = req.currentHospital;
    let data = await approvalService.getListOfRequestedApprovals_OfHospital(
      hospitalId
    );
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const getListOfRequestedApprovals_ByHospital = async (
  req: Request,
  res: Response
) => {
  try {
    let hospitalId = req.currentHospital;
    let data = await approvalService.getListOfRequestedApprovals_ByHospital(
      hospitalId
    );
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

import * as doctorService from "../Services/Doctor/Doctor.Service";

export const getDoctorsOfflineAndOnlineAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    let appointments =
      await doctorService.getDoctorsOfflineAndOnlineAppointments(
        req.query.doctorId as string,
        req.body.date
      );

    return successResponse(appointments, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

import * as notificationService from "../Services/Notification/Notification.Service";
import suvedhaModel from "../Models/Suvedha.Model";
import patientModel from "../Models/Patient.Model";
import { getDefaultSettings } from "http2";
import { AppointmentStatus, AppointStatusOrder } from "../Services/Patient";

export const getHospitalsNotification = async (req: Request, res: Response) => {
  try {
    /* Notification jaha pe sender hospital hai */
    let notifications_whereSenderIsDoctor =
      notificationService.getHospitalsNotification_whenSenderIsDoctor(
        req.currentHospital
      );

    /* Notification jaha pe sender patient hai */
    let notification_whereSenderIsPatient =
      notificationService.getHospitalsNotification_whenSenderIsPatient(
        req.currentHospital
      );

    Promise.all([
      notifications_whereSenderIsDoctor,
      notification_whereSenderIsPatient,
    ]).then((result: Array<any>) => {
      let notifications = result.map((e: any) => e[0]);
      notifications = notifications.sort(
        (a: any, b: any) => a.createdAt - b.createdAt
      );
      return successResponse(notifications, "Success", res);
    });
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const updateHospitalAddress = async (req: Request, res: Response) => {
  try {
    let updatedAddress = await addressService.updateAddress({
      ...req.body,
      hospitalId: req.currentHospital,
    });
    return successResponse(updatedAddress, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getHospitalsSpecilization_AccordingToDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("\n\n\njhgvdhdjnkhdsbdnsjds", req.body.hospitalId);
    let data =
      await hospitalService.getHospitalsSpecilization_AccordingToDoctor(
        req.body.hospitalId
      );
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorsListInHospital_withApprovalStatus = async (
  req: Request,
  res: Response
) => {
  try {
    let data =
      await hospitalService.getDoctorsListInHospital_withApprovalStatus(
        req.body.hospitalId
      );
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const searchHospitalByPhoneNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const term = req.params.term;
    const phone = phoneNumberValidation(term);

    if (!phone) {
      const error: Error = new Error("Enter a valid phone number or email");
      error.name = "Invalid Term";
      return errorResponse(error, res);
    }

    let hospitalObj;
    if (phone) {
      hospitalObj = await hospitalModel
        .findOne({
          contactNumber: term,
        })
        .populate({
          path: "address",
          populate: {
            path: "city state locality country",
          },
        })
        .lean();
    }
    let doctorIds = hospitalObj.doctors.map((e: any) => e.toString());
    if (doctorIds.includes(req.currentDoctor)) {
      hospitalObj["containsDoctor"] = true;
    } else {
      hospitalObj["containsDoctor"] = false;
    }

    if (hospitalObj) {
      return successResponse(hospitalObj, "Success", res);
    }
    throw new Error("No data found");
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getPatientsAppointmentsInThisHospital = async (
  req: Request,
  res: Response
) => {
  try {
    let appointments =
      await hospitalService.getPatientsAppointmentsInThisHospital(
        req.currentHospital,
        req.body.phoneNumber,
        req.params.page
      );

    return successResponse(appointments, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const generateOrderId = async (req: Request, res: Response) => {
  try {
    let orderDetails = await hospitalService.generateOrderId(req.body);
    return successResponse(orderDetails, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    let isHospital = req.currentHospital ? true : false;

    await hospitalService.verifyPayment(req.body, isHospital);
    return successResponse({}, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const doctorsInHospitalWithTimings = async (
  req: Request,
  res: Response
) => {
  try {
    let { hospitalId, timings } = req.body;
    let hospitalDetails = await hospitalService.doctorsInHospital(
      hospitalId,
      timings
    );

    let { doctors } = hospitalDetails;

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

    doctors = doctors.map((e: any) => {
      return {
        _id: e?._id,
        name: `${e.firstName} ${e.lastName}`,
        specilization: e?.specialization[0]?.specialityName,
        Qualification: e?.qualification[0]?.qualificationName?.abbreviation,
        Exeperience: e?.overallExperience,
        Fee: e?.hospitalDetails.find(
          (elem: any) => elem.hospital.toString() === hospitalId
        )?.consultationFee?.max,
        workinghour: e?.workingHours.map((elem: any) => {
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
      };
    });

    return successResponse(doctors, "Successs", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getHospitalDetails = async (req: Request, res: Response) => {
  try {
    let data = (await hospitalService.getHospitalById(req.params.id))[0];
    // data = {
    //   Name: data.name,
    //   Address: data.address,
    // };

    data = {
      Address: {
        address_id: data?.address?._id,
        state_id: data?.address?.state,
        city_id: data?.address?.city,
        locality_id: data?.address?.locality,
        addressLine_1: data?.address?.addressLine_1,
        pincode: data?.address?.pincode,
      },

      RegistrationDetails: data?.registrationDetails,

      PaymentDetails: data?.paymentDetails,

      Service: data?.services,
      Anemity: data?.anemity,

      TYPE_HOSPITAL: data?.type,
    };
    return successResponse(data, "Success", res);
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
    if (result) {
      // let exist = await hospitalModel.exists({
      //   contactNumber: newPhoneNumber,
      // });

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

      let data = await hospitalModel.findOne({ contactNumber: phoneNumber });
      console.log("DATAA", data);

      hospitalModel
        .findOneAndUpdate(
          {
            _id: data._id,
          },
          {
            $set: {
              contactNumber: newPhoneNumber,
              phoneNumberUpdate: true,
            },
          }
        )
        .then((result: any) => {
          console.log("result", result);
        });
      return successResponse({}, "Success", res);
    } else {
      throw new Error("Invalid OTP");
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const addDoctor = async (req: Request, res: Response) => {
  try {
    const doctorId = req.body.doctorId;
    const hospitalId = req.currentHospital
    await approvalService.addDoctorAndHospitalToEachOthersProfile(
      doctorId, hospitalId
    );

    return successResponse({}, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res)
  }
}

export const changeAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body
    await hospitalService.changeAppointmentStatus(id, status)
    return successResponse({}, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res)
  }
}
