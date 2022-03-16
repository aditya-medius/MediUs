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

export const addSpeciality = async (req: Request, res: Response) => {
  try {
    const body = req.body;
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
    let cityObj = await new cityModel(body).save();
    return successResponse(cityObj, "City has been successfully added", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

//add state
export const addState = async (req: Request, res: Response) => {
  try {
    let body = req.body;
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
    let localityObj = await new LocalityModel(body).save();
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
  } catch (error: any) {}
};

// Get cities, states, locality and country
export const getCityStateLocalityCountry = async (
  req: Request,
  res: Response
) => {
  try {
    const city = await cityModel.find();
    const state = await stateModel.find();
    const locality = await LocalityModel.find();
    const country = await countryModel.find();

    const [Ci, S, L, Co] = await Promise.all([city, state, locality, country]);
    let response: any = {};
    let { region } = req.query;
    if (region) {
      region = (region as string).toLowerCase();
      if (region == "city") {
        response[region] = Ci;
      } else if (region == "state") {
        response[region] = S;
      } else if (region == "locality") {
        response[region] = L;
      } else if (region == "country") {
        response[region] = Co;
      }
    } else {
      response = { city: Ci, state: S, locality: L, country: Co };
    }

    return successResponse(response, "Success", res);
  } catch (error: any) {}
};

export const login = async (req: Request, res: Response) => {
  try {
    let body: any = req.query;
    if (!("OTP" in body)) {
      if (/^[0]?[6789]\d{9}$/.test(body.phoneNumber)) {
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

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
        // Implement message service API
        // sendMessage(`Your OTP is: ${OTP}`, body.phoneNumber)
        //   .then(async (message: any) => {
        //   })
        //   .catch((error) => {
        //     throw error;
        //   });

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
          const profile = await adminModel.findOne({
            phoneNumber: body.phoneNumber,
          });
          if (profile) {
            const token = await jwt.sign(
              profile.toJSON(),
              process.env.SECRET_ADMIN_KEY as string
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

// Country, State, City ki mapping
// export const setCountryMap

// Service Controller
export const addHospitalService = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let serviceObj = await new servicesModel(body).save();
    return successResponse(serviceObj, "Successfully created services", res);
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
    const doctorList = await doctorModel.find(
      {
        deleted: false,
        adminSearch: true,
      },
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

export const getAllAgentList = async (req: Request, res: Response) => {
  try {
    const agentList = await agentModel.find({
      "delData.deleted": false,
      adminSearch: true,
    });
    return successResponse(
      agentList,
      "Successfully fetched Agent's list",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
export const getAllHospitalList = async (req: Request, res: Response) => {
  try {
    const hospitalList = await hospitalModel.find({
      "delData.deleted": false,
      adminSearch: true,
    });
    return successResponse(
      hospitalList,
      "Successfully fetched Hospital's list",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
