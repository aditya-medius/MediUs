import { Request, Response } from "express";
import bodyPartModel from "./BodyPart.Model";
import specialityBodyModel from "./SpecialityBody.Model";
import specialityDiseaseModel from "./SpecialityDisease.Model";
import specialityModel from "./Specialization.Model";
import cityModel from "./City.Model";
import stateModel from "./State.Model";
import countryModel from "./Country.Model";
import { errorResponse, successResponse } from "../Services/response";
import LocalityModel from "./Locality.Model";

import diseaseModel from "./Disease.Model";
import doctorTypeModel from "./DoctorType.Model";
import specialityDoctorTypeModel from "./SpecialityDoctorType.Model";

import paymentModel from "./Payment.Model";
import adminModel from "./Admin.Model";

import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { sendMessage } from "../Services/message.service";
import otpModel from "../Models/OTP.Model";
import servicesModel from "./Services.Model";
import doctorModel from "../Models/Doctors.Model";
import hospitalModel from "../Models/Hospital.Model";
import { excludeDoctorFields } from "../Controllers/Doctor.Controller";
import agentModel from "../Models/Agent.Model";
import * as adminService from "../Services/Admin/Admin.Service";
import patientModel from "../Models/Patient.Model";
import appointmentModel from "../Models/Appointment.Model";

import * as feeService from "../Module/Payment/Service/Fee.Service";

import * as ownershipService from "../Services/Ownership/Ownership.Service";

export const addSpeciality = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let exist = await specialityModel.exists(body);
    if (exist) {
      return errorResponse(new Error("Speciality already exist"), res);
    }
    const data = await new specialityModel(body).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

/*
  Body parts - START
*/
// Add body part
export const addBodyPart = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let exist = await bodyPartModel.exists(body);
    if (exist) {
      return errorResponse(new Error("Body Part already exist"), res);
    }
    const data = await new bodyPartModel(body).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

// Add Speciality and body record
export const addSpecialityBody = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.bodyParts = [...new Set(body.bodyParts)];
    const data = await new specialityBodyModel({
      speciality: body.speciality,
      bodyParts: body.bodyParts,
    }).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

// Update speciality Body Model
export const addToSpecialityBody = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.bodyParts = [...new Set(body.bodyParts)];
    const data = await specialityBodyModel.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { bodyParts: body.bodyParts } },
      { new: true }
    );
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
/*
  Body Part - END
*/

/*
  Disease - START
*/
// Add disease
export const addDisease = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let exist = await diseaseModel.exists(body);
    if (exist) {
      return errorResponse(new Error("Disease already exist"), res);
    }
    const data = await new diseaseModel(body).save();
    return successResponse(data, "Successfully added disease", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

// Add Speciality and Disease record
export const addSpecialityDisease = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.disease = [...new Set(body.disease)];
    const data = await new specialityDiseaseModel({
      speciality: body.speciality,
      disease: body.disease,
    }).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

// Update speciality Body Model
export const addToSpecialityDisease = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.disease = [...new Set(body.disease)];
    const data = await specialityDiseaseModel.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { disease: body.disease } },
      { new: true }
    );
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
/*
  Disease - END
*/

/*
  Doctor Type - START
*/
// Add Doctor Type
export const addDoctorType = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let exist = await doctorTypeModel.exists(body);
    if (exist) {
      return errorResponse(new Error("Doctor Type already exist"), res);
    }
    const data = await new doctorTypeModel(body).save();
    return successResponse(data, "Successfully added doctor type", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

// Add Speciality and Doctor type record
export const addSpecialityDoctorType = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.doctorType = [...new Set(body.doctorType)];
    const data = await new specialityDoctorTypeModel({
      speciality: body.speciality,
      doctorType: body.doctorType,
    }).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

// Update speciality Body Model
export const addToSpecialityDoctorType = async (
  req: Request,
  res: Response
) => {
  try {
    let body = req.body;
    body.doctorType = [...new Set(body.doctorType)];
    const data = await specialityDoctorTypeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { doctorType: body.doctorType } },
      { new: true }
    );
    return successResponse(data, "Successfully updated data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
/*
  Doctor Type - END
*/

//add city
export const addCity = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let exist = await cityModel.exists(body);
    if (exist) {
      return errorResponse(new Error("City already exist"), res);
    }
    let cityObj = await new cityModel(body).save();

    cityObj["city-id"] = cityObj._id;
    cityObj.save();
    return successResponse(cityObj, "City has been successfully added", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

//add state
export const addState = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let exist = await stateModel.exists(body);
    if (exist) {
      return errorResponse(new Error("State already exist"), res);
    }
    let stateObj = await new stateModel(body).save();
    return successResponse(stateObj, "State has been successfully added", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
//add locality
export const addLocality = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let exist = await LocalityModel.exists(body);
    if (exist) {
      return errorResponse(new Error("Locality already exist"), res);
    }
    let localityObj = await new LocalityModel(body).save();

    localityObj["localityid"] = localityObj._id;
    localityObj.save();
    return successResponse(
      localityObj,
      "Locality has been successfully added",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
//add country
export const addCountry = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let exist = await countryModel.exists(body);
    if (exist) {
      return errorResponse(new Error("Country already exist"), res);
    }
    let countryObj = await new countryModel(body).save();
    return successResponse(
      countryObj,
      "Country has been successfully added",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
//add payment options
export const addPayment = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let paymentObj = await new paymentModel(body).save();
    return successResponse(
      paymentObj,
      "Payment Options has been successfully added",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// get payment options
export const getPayments = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let paymentObj = await paymentModel.find({});
    return successResponse(paymentObj, "Success", res);
  } catch (error: any) { }
};

// Get cities, states, locality and country
export const getCityStateLocalityCountry = async (
  req: Request,
  res: Response
) => {
  try {
    let { page = 0, limit = 20 } = req.query;

    page = parseInt(page as string);
    limit = parseInt(limit as string);

    const city = await cityModel.find();
    const state = await stateModel.find();
    const locality = await LocalityModel.find()
      .skip(limit * page)
      .limit(limit);

    const localityCount = await LocalityModel.count();

    const country = await countryModel.find();

    const [Ci, S, L, Co] = await Promise.all([city, state, locality, country]);
    let response: any = {};
    let { region } = req.query;
    if (region) {
      region = (region as string).toLowerCase();
      if (region === "city") {
        response[region] = Ci;
      } else if (region === "state") {
        response[region] = S;
      } else if (region === "locality") {
        response[region] = L;
        response["count"] = localityCount;
      } else if (region === "country") {
        response[region] = Co;
      }
    } else {
      // response = { city: Ci, state: S, locality: L, country: Co };
      response = { state: S };
    }

    return successResponse({ ...response }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// export const login = async (req: Request, res: Response) => {
//   try {
//     let body: any = req.query;
//     if (!("OTP" in body)) {
//       if (/^[0]?[6789]\d{9}$/.test(body.phoneNumber)) {
//         const OTP = Math.floor(100000 + Math.random() * 900000).toString();

//         // Implement message service API
//         sendMessage(`Your OTP is: ${OTP}`, body.phoneNumber)
//           .then(async (message: any) => {
//             const otpToken = jwt.sign(
//               { otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 },
//               OTP
//             );
//             // Add OTP and phone number to temporary collection
//             await otpModel.findOneAndUpdate(
//               { phoneNumber: body.phoneNumber },
//               { $set: { phoneNumber: body.phoneNumber, otp: otpToken } },
//               { upsert: true }
//             );
//           })
//           .catch((error) => {
//             throw error;
//           });

//         return successResponse({}, "OTP sent successfully", res);
//       } else {
//         let error = new Error("Invalid phone number");
//         error.name = "Invalid input";
//         return errorResponse(error, res);
//       }
//     } else {
//       const otpData = await otpModel.findOne({
//         phoneNumber: body.phoneNumber,
//       });
//       try {
//         const data: any = await jwt.verify(otpData.otp, body.OTP);
//         if (Date.now() > data.expiresIn)
//           return errorResponse(new Error("OTP expired"), res);
//         if (body.OTP === data.otp) {
//           const profile = await adminModel.findOne({
//             phoneNumber: body.phoneNumber,
//           });
//           if (profile) {
//             const token = await jwt.sign(
//               profile.toJSON(),
//               process.env.SECRET_ADMIN_KEY as string
//             );
//             otpData.remove();
//             return successResponse(token, "Successfully logged in", res);
//           } else {
//             otpData.remove();
//             return successResponse(
//               { message: "No Data found" },
//               "Create a new profile",
//               res,
//               201
//             );
//           }
//         } else {
//           const error = new Error("Invalid OTP");
//           error.name = "Invalid";
//           return errorResponse(error, res);
//         }
//       } catch (err) {
//         if (err instanceof jwt.JsonWebTokenError) {
//           const error = new Error("OTP isn't valid");
//           error.name = "Invalid OTP";
//           return errorResponse(error, res);
//         }
//         return errorResponse(err, res);
//       }
//     }
//   } catch (error: any) {
//     return errorResponse(error, res);
//   }
// };

export const login = async (req: Request, res: Response) => {
  try {
    let body: any = req.query;
    const profile = await adminModel.findOne({
      phoneNumber: body.phoneNumber,
    });

    let compRes = await bcrypt.compare(body.password, profile.password);
    if (compRes) {
      let token = await adminService.getAdminToken(profile.toObject());
      return successResponse(token, "Success", res);
    } else {
      return errorResponse(new Error("Invalid password"), res, 400);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let cryptSalt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, cryptSalt);
    let adminObj = await new adminModel(body).save();
    jwt.sign(
      adminObj.toJSON(),
      process.env.SECRET_ADMIN_KEY as string,
      (err: any, token: any) => {
        if (err) return errorResponse(err, res);
        return successResponse(
          token,
          "Admin profile successfully created",
          res
        );
      }
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Service Controller
export const addHospitalService = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let exist = await servicesModel.exists(body);
    if (exist) {
      return errorResponse(new Error("Service already exist"), res);
    }
    let serviceObj = await new servicesModel(body).save();
    return successResponse(serviceObj, "Successfully created services", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const deleteHospitalService = async (req: Request, res: Response) => {
  try {
    return successResponse(
      await servicesModel.findOneAndDelete({ _id: req.params.id }),
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Unverified users ko get krne ki query
export const getUnverifiedDoctors = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    const unverifiedDoctors = await doctorModel.find({
      verified: false,
      adminSearch: true,
    });

    return successResponse(unverifiedDoctors, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const verifyDoctors = async (req: Request, res: Response) => {
  try {
    let body = req.params;
    const doctorObj = await doctorModel.findOneAndUpdate(
      {
        _id: body.doctorId,
        deleted: false,
        // verified: false,
        adminSearch: true,
      },
      {
        $set: {
          verified: true,
        },
      }
    );
    if (doctorObj.verified) {
      throw new Error("Doctor is already verified");
    } else {
      return successResponse({}, "Successfully verified", res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const verifyHospitals = async (req: Request, res: Response) => {
  try {
    let body = req.params;
    const hospitalObj = await hospitalModel.findOneAndUpdate(
      {
        _id: body.hospitalId,
        deleted: false,
        // verified: false,
        adminSearch: true,
      },
      {
        $set: {
          verified: true,
        },
      }
    );
    if (hospitalObj.verified) {
      throw new Error("Hospital is already verified");
    } else {
      return successResponse({}, "Successfully verified", res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getAllDoctorsList = async (req: Request, res: Response) => {
  try {
    // const doctorList = await doctorModel.find(
    //   {
    //     deleted: false,
    //     adminSearch: true,
    //   },
    //   excludeDoctorFields
    // ).populate("specialization")
    const doctorList = await doctorModel.aggregate([
      {
        $lookup: {
          from: "appointments",
          let: {
            id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$doctors", "$$id"],
                },
              },
            },
            {
              $count: "appointment",
            },
          ],
          as: "appointment",
        },
      },
      {
        $lookup: {
          from: "specializations",
          localField: "specialization",
          foreignField: "_id",
          as: "specialization",
        },
      },
      {
        $addFields: {
          overallExperience: {
            $function: {
              body: function (dob: any) {
                dob = new Date(dob);
                var currentDate = new Date();
                var age: string | number =
                  currentDate.getFullYear() - dob.getFullYear();
                if (age > 0) {
                  age = `${age} years`;
                } else {
                  age = `${age} months`;
                }
                return age;
              },
              args: ["$overallExperience"],
              lang: "js",
            },
          },
        },
      },
    ]);
    return successResponse(
      doctorList,
      "Successfully fetched doctor's list",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const verifyAgents = async (req: Request, res: Response) => {
  try {
    let body = req.params;
    const agentObject = await agentModel.findOneAndUpdate(
      {
        _id: body.agentId,
        deleted: false,
        // verified: false,
        adminSearch: true,
      },
      {
        $set: {
          verified: true,
        },
      }
    );
    if (agentObject.verified) {
      throw new Error("Agent is already verified");
    } else {
      return successResponse({}, "Successfully verified", res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getAllPatientList = async (req: Request, res: Response) => {
  try {
    const patientList = await patientModel.find({});
    return successResponse(patientList, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getAllAgentList = async (req: Request, res: Response) => {
  try {
    const agentList = await agentModel.find({
      "delData.deleted": false,
      adminSearch: true,
    });
    return successResponse(agentList, "Successfully fetched Agent's list", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getAllSuvedhaList = async (req: Request, res: Response) => {
  try {
    const suvedhaList = await suvedhaModel
      .find({
        deleted: false,
      })
      .populate({ path: "address", populate: "city locality state" });
    return successResponse(
      suvedhaList,
      "Successfully fetched Agent's list",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const getAllHospitalList = async (req: Request, res: Response) => {
  try {
    // const hospitalList = await hospitalModel.find({
    //   "delData.deleted": false,
    //   adminSearch: true,
    // });

    const hospitalList = await hospitalModel.aggregate([
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: {
          path: "$address",
        },
      },
      {
        $lookup: {
          from: "appointments",
          let: {
            id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$hospital", "$$id"],
                },
              },
            },
            {
              $count: "appointment",
            },
          ],
          as: "appointment",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "address.city",
          foreignField: "_id",
          as: "address.city",
        },
      },
      {
        $unwind: {
          path: "$address.city",
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "address.state",
          foreignField: "_id",
          as: "address.state",
        },
      },
      {
        $unwind: {
          path: "$address.state",
        },
      },
      {
        $lookup: {
          from: "localities",
          localField: "address.locality",
          foreignField: "_id",
          as: "address.locality",
        },
      },
      {
        $unwind: {
          path: "$address.locality",
        },
      },
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

/*
 Country, State, City ki mapping
*/
import CountryMapModel from "../Admin Controlled Models/Country.Map.Model";
import StateMapModel from "../Admin Controlled Models/State.Map.Model";
import CityMapModel from "../Admin Controlled Models/City.Map.Model";
import qualificationNameModel from "./QualificationName.Model";
import ownershipModel from "../Models/Ownership.Model";
import { city } from "../Services/schemaNames";
import suvedhaModel from "../Models/Suvedha.Model";
import feeModel from "../Module/Payment/Model/Fee.Model";
import helpLineNumberModel from "../Models/HelplineNumber.Model";
import { HelplineNumber } from "../Services/Patient";

export const setCountryMap = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let countryMap: any = await adminService.checkIfMapExist(
      {
        country: body.country,
        state: { $in: body.state },
      },
      CountryMapModel
    );
    if (typeof countryMap === "boolean" && countryMap === true) {
      return errorResponse(new Error("Country-State map already exist"), res);
    }
    body.state = countryMap;
    let map = await adminService.createCountryMap(body);
    return successResponse(map, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const setStateMap = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let stateMap: any = await adminService.checkIfMapExist(
      {
        state: body.state,
        city: { $in: body.city },
      },
      StateMapModel
    );
    if (typeof stateMap === "boolean" && stateMap === true) {
      return errorResponse(new Error("State-City Map already exist"), res);
    }
    body.city = stateMap;
    let map = await adminService.createStateMap(body);
    return successResponse(map, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const setCityMap = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let cityMap: any = await adminService.checkIfMapExist(
      {
        city: body.city,
        locality: { $in: body.locality },
      },
      CityMapModel
    );
    if (typeof cityMap === "boolean" && cityMap === true) {
      return errorResponse(new Error("City-Locality Map already exist"), res);
    }
    body.locality = cityMap;
    let map = await adminService.createCityMap(body);
    return successResponse(map, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getStateByCountry = async (req: Request, res: Response) => {
  try {
    let list: any = await adminService.getStateByCountry(req.body);
    return successResponse(list, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const getCityByState = async (req: Request, res: Response) => {
  try {
    let list: any = await adminService.getCityByState(req.body);
    return successResponse(list, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getLocalityByCity = async (req: Request, res: Response) => {
  try {
    let list: any = await adminService.getLocalityByCity(req.body);
    return successResponse(list, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const uploadCSV_state = async (req: Request, res: Response) => {
  try {
    let data = await adminService.handleCSV_state(req.file);
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const uploadCSV_city = async (req: Request, res: Response) => {
  try {
    let data = await adminService.handleCSV_city(req.file);
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const uploadCSV_locality = async (req: Request, res: Response) => {
  try {
    let data = await adminService.handleCSV_locality(req.file);
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

/* Qualification add kro */
export const addQualificationn = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let data = await new qualificationNameModel(body).save();
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    let appointments = await appointmentModel
      .find()
      .populate({
        path: "patient",
      })
      .populate({
        path: "doctors",
        select: excludeDoctorFields,
        populate: "specialization",
      })
      .populate({
        path: "hospital",
      })
      .populate({
        path: "subPatient",
      })
      .sort({ createdAt: -1 });
    return successResponse(appointments, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const createFee = async (req: Request, res: Response) => {
  try {
    let { name, feeAmount } = req.body;
    let data = await feeService.setFee(name, feeAmount);
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getFees = async (req: Request, res: Response) => {
  try {
    return successResponse(await feeService.getAllFees(), "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const addOwnership = async (req: Request, res: Response) => {
  try {
    let ownershipData = await ownershipService.addOwnership(req.body);
    return successResponse(ownershipData, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getOwnership = async (req: Request, res: Response) => {
  try {
    let ownershipData = await ownershipService.getOwnership();
    return successResponse(ownershipData, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const deleteOwnership = async (req: Request, res: Response) => {
  try {
    return successResponse(
      await ownershipService.deleteOwnership(req.params.id),
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const editSpeciality = async (req: Request, res: Response) => {
  try {
    const { specialityId } = req.body;
    let exist = await specialityModel.exists({ _id: specialityId });
    if (!exist) {
      return errorResponse(new Error("Speciality doesn't exist"), res);
    }
    let { image, name } = req.body;

    let data = await specialityModel.findOneAndUpdate(
      { _id: specialityId },
      {
        $set: {
          ...(image && { image }),
          ...(name && { specialityName: name }),
        },
      }
    );

    return successResponse({ success: true }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const editFee = async (req: Request, res: Response) => {
  try {
    const { feeId, name, amount } = req.body;
    let exist = await feeModel.exists({ _id: feeId });

    if (!exist) {
      return errorResponse(new Error("Fee doesn't exist"), res);
    }
    feeModel
      .findOneAndUpdate(
        {
          _id: feeId,
        },
        {
          $set: {
            ...(amount && { feeAmount: amount }),
            ...(name && { name }),
          },
        }
      )
      .then((result: any) => {
        console.log("dsjgfdvsdds", result);
      });
    return successResponse({ success: true }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getHospitalById = async (req: Request, res: Response) => {
  try {
    const hospital = await hospitalModel
      .findOne({ _id: req.params.id }, "-password ")
      .populate("doctors anemity services")
      .populate({
        path: "address",
        populate: "city locality",
      });
    return successResponse(hospital, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await doctorModel.findOne(
      { _id: req.params.id },
      "-password"
    );
    return successResponse(doctor, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const addHelplineNumber = async (req: Request, res: Response) => {
  try {
    const body: HelplineNumber = req.body
    const data = await helpLineNumberModel.findOneAndUpdate({ number: body.number }, body, { upsert: true, new: true })
    return successResponse(data, "Successfully created data", res);
  } catch (error: any) {
    return errorResponse(error, res)
  }
}

export const getHelplineNumber = async (req: Request, res: Response) => {
  try {
    const data = await helpLineNumberModel.find().lean()
    return successResponse(data, "Successfully fetched data", res);
  } catch (error: any) {
    return errorResponse(error, res)
  }
}