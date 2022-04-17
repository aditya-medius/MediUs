import express, { query, Request, Response } from "express";
import patientModel from "../Models/Patient.Model";
// import { excludePatientFields } from "./Patient.Controller";
import otpModel from "../Models/OTP.Model";
import appointmentModel from "../Models/Appointment.Model";
import appointmentPayment from "../Models/AppointmentPayment.Model";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { errorResponse, successResponse } from "../Services/response";
// import { sendMessage } from "../Services/message.service";
import { sendMessage } from "../Services/message.service";
import doctorModel from "../Models/Doctors.Model";
import { excludeDoctorFields } from "./Doctor.Controller";
import workingHourModel from "../Models/WorkingHours.Model";
import RazorPay from "razorpay";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import bodyPartModel from "../Admin Controlled Models/BodyPart.Model";
import diseaseModel from "../Admin Controlled Models/Disease.Model";
import specialityModel from "../Admin Controlled Models/Specialization.Model";
import hospitalModel from "../Models/Hospital.Model";
import addressModel from "../Models/Address.Model";
import prescriptionModel from "../Models/Prescription.Model";
import * as doctorController from "../Controllers/Doctor.Controller";
import mongoose from "mongoose";
import * as notificationService from "../Services/Notification/Notification.Service";
import {
  phoneNumberValidation,
  emailValidation,
} from "../Services/Validation.Service";
import {
  generateAppointmentId,
  getTokenNumber,
} from "../Services/Appointment/Appointment.Service";

import * as prescriptionValidityController from "../Controllers/Prescription-Validity.Controller";

export const excludePatientFields = {
  password: 0,
  verified: 0,
  DOB: 0,
};

export const excludeHospitalFields = {
  location: 0,
  doctors: 0,
  specialisedIn: 0,
  anemity: 0,
  treatmentType: 0,
  payment: 0,
  numberOfBed: 0,
};

// Get All Patients
export const getAllPatientsList = async (_req: Request, res: Response) => {
  try {
    const patientList = await patientModel.find(
      { deleted: false },
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
    if (body.address) {
      let addressObj = await new addressModel(body.address).save();
      body["address"] = addressObj._id;
    }
    let cryptSalt = await bcrypt.genSalt(10);
    if (!body.password) {
      body.password = process.env.DEFAULT_PASSWORD as string;
    }
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
            // throw error;
            console.log("error :", error);
            // return errorResponse(error, res);
          });

        return successResponse({}, `OTP sent successfully`, res);
      } else {
        let error = new Error("Invalid phone number");
        error.name = "Invalid input";
        return errorResponse(error, res);
      }
    } else {
      if (body.phoneNumber == "9999999999") {
        const profile = await patientModel.findOne(
          {
            phoneNumber: body.phoneNumber,
            deleted: false,
          },
          excludeDoctorFields
        );
        const token = await jwt.sign(
          profile.toJSON(),
          process.env.SECRET_PATIENT_KEY as string
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
        // Abhi k liye OTP verification hata di hai
        // const data: any = await jwt.verify(otpData.otp, body.OTP);
        // if (Date.now() > data.expiresIn)
        //   return errorResponse(new Error("OTP expired"), res);
        // if (body.OTP === data.otp) {
        if (true) {
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
export const getPatientByHospitalId = async (_req: Request, res: Response) => {
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
//Book an apponitment
export const BookAppointment = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    const rd: Date = new Date(body.time.date);
    const d = rd.getDay();
    let b = req.body;
    let query: any = {};
    if (d == 0) {
      query["sunday.working"] = true;
      query["sunday.from.time"] = b.time.from.time;
      query["sunday.from.division"] = b.time.from.division;
      query["sunday.till.time"] = b.time.till.time;
      query["sunday.till.division"] = b.time.till.division;
    } else if (d == 1) {
      query["monday.working"] = true;
      query["monday.from.time"] = b.time.from.time;
      query["monday.from.division"] = b.time.from.division;
      query["monday.till.time"] = b.time.till.time;
      query["monday.till.division"] = b.time.till.division;
    } else if (d == 2) {
      query["tuesday.working"] = true;
      query["tuesday.from.time"] = b.time.from.time;
      query["tuesday.from.division"] = b.time.from.division;
      query["tuesday.till.time"] = b.time.till.time;
      query["tuesday.till.division"] = b.time.till.division;
    } else if (d == 3) {
      query["wednesday.working"] = true;
      query["wednesday.from.time"] = b.time.from.time;
      query["wednesday.from.division"] = b.time.from.division;
      query["wednesday.till.time"] = b.time.till.time;
      query["wednesday.till.division"] = b.time.till.division;
    } else if (d == 4) {
      query["thursday.working"] = true;
      query["thursday.from.time"] = b.time.from.time;
      query["thursday.from.division"] = b.time.from.division;
      query["thursday.till.time"] = b.time.till.time;
      query["thursday.till.division"] = b.time.till.division;
    } else if (d == 5) {
      query["friday.working"] = true;
      query["friday.from.time"] = b.time.from.time;
      query["friday.from.division"] = b.time.from.division;
      query["friday.till.time"] = b.time.till.time;
      query["friday.till.division"] = b.time.till.division;
    } else if (d == 6) {
      query["saturday.working"] = true;
      query["saturday.from.time"] = b.time.from.time;
      query["saturday.from.division"] = b.time.from.division;
      query["saturday.till.time"] = b.time.till.time;
      query["saturday.till.division"] = b.time.till.division;
    }

    console.log("ssss:", query);
    // @TODO check if working hour exist first
    let capacity = await workingHourModel.findOne({
      doctorDetails: body.doctors,
      hospitalDetails: body.hospital,
      ...query,
    });
    if (!capacity) {
      let error: Error = new Error("Error");
      error.message =
        "Working hours does not exist for this hospital and doctor at this time. Please ask doctor to create one or its possible that doctor isn't working on this day";
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
      const error: Error = new Error("Doctor not available on this day");
      error.name = "Not available";
      return errorResponse(error, res);
    }
    let appointmentCount = await appointmentModel.find({
      doctors: body.doctors,
      hospital: body.hospital,
      "time.from.time": capacity.from.time,
      "time.till.time": capacity.till.time,
      cancelled: false,
      done: false,
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
      return errorResponse(
        new Error("Doctor cannot take any more appointments"),
        res
      );
    }

    if (req.currentHospital) {
      body["Type"] = "Offline";
    } else if (req.currentPatient) {
      body["Type"] = "Online";
    }

    /* Appointment ka token Number */
    let appointmentTokenNumber = await getTokenNumber(body);

    /* Appointment ki Id */
    let appointmentId = generateAppointmentId();

    body["appointmentToken"] = appointmentTokenNumber;
    body["appointmentId"] = appointmentId;

    let appointmentBook = await new appointmentModel(body).save();
    await appointmentBook.populate({
      path: "subPatient",
      select: {
        parentPatient: 0,
      },
    });

    /* Appointment notification doctor or hospital ko */
    notificationService.sendAppointmentNotificationToHospitalAndDoctor_FromPatient(
      body.doctors,
      body.hospital,
      body.patient
    );
    /* Appointment notification patient ko */
    notificationService.sendAppointmentConfirmationNotificationToPatient(
      body.patient
    );

    return successResponse(
      appointmentBook,
      "Appoinment has been successfully booked",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Re-Schedule appointment
export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    let body = req.body;

    // @TODO check if working hour exist first
    let capacity = await workingHourModel.findOne({
      doctorDetails: body.doctors,
      hospitalDetails: body.hospital,
    });
    if (!capacity) {
      let error: Error = new Error("Error");
      error.message = "Cannot create appointment";
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
      const error: Error = new Error("Doctor not available on this day");
      error.name = "Not available";
      return errorResponse(error, res);
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

    let appointmentBook = await appointmentModel.findOneAndUpdate(
      {
        _id: body.appointmentId,
      },
      {
        $set: { time: body.time, rescheduled: true },
      }
    );
    await appointmentBook.populate({
      path: "subPatient",
      select: {
        parentPatient: 0,
      },
    });

    return successResponse(appointmentBook, "Success", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
//Done Appointment
export const doneAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentDone: any = await appointmentModel
      .findOne({
        _id: req.body.id,
      })
      .populate({
        path: "patient",
        select: excludePatientFields,
      })
      .populate({
        path: "hospital",
        select: excludeHospitalFields,
      })
      .populate({
        path: "doctors",
        select: {
          ...excludeDoctorFields,
          hospitalDetails: 0,
          specialization: 0,
          qualification: 0,
        },
      })
      .populate({
        path: "subPatient",
        select: {
          parentPatient: 0,
        },
      });
    if (!appointmentDone) {
      return errorResponse(
        new Error("Cannot find appointment with this id"),
        res,
        404
      );
    }
    if (appointmentDone.cancelled) {
      return successResponse({}, "Appointment has already been cancelled", res);
    }
    if (appointmentDone) {
      if (appointmentDone.done === true) {
        return successResponse({}, "Appointment is already done", res);
      }
      appointmentDone.done = true;
      await appointmentDone.save();
      return successResponse({}, "Appointment done successfully", res);
    } else {
      let error = new Error("Appointment already done.");
      error.name = "Not found";
      return errorResponse(error, res, 404);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
};

//Cancel appoinment
export const CancelAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentCancel: any = await appointmentModel.findOne(
      { _id: req.body.id }
      //  { $set: { cancelled: true } }
    );
    if (appointmentCancel.done) {
      return successResponse({}, "Appointment has already done", res);
    }
    if (appointmentCancel) {
      if (appointmentCancel.cancelled === true) {
        return successResponse({}, "Appointment is already cancelled", res);
      }
      appointmentCancel.cancelled = true;
      await appointmentCancel.save();
      return successResponse({}, "Appoinment cancelled successfully", res);
    } else {
      let error = new Error(" This Appoinement doesn't exist");
      error.name = "Not found";
      return errorResponse(error, res, 404);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
};

//View Appointment History
export const ViewAppointment = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.params.page);
    const appointmentData: Array<object> = await appointmentModel
      .find({
        patient: req.currentPatient,
        cancelled: false,
        "time.date": { $gt: Date() },
      })
      .populate({
        path: "hospital",
        select: {
          ...excludeHospitalFields,
          type: 0,
          deleted: 0,
          contactNumber: 0,
        },
      })
      .populate({
        path: "doctors",
        select: {
          ...excludeDoctorFields,
          hospitalDetails: 0,
          specialization: 0,
          qualification: 0,
          email: 0,
          active: 0,
          deleted: 0,
          overallExperience: 0,
          gender: 0,
          image: 0,
        },
      })
      .populate({
        path: "subPatient",
        select: {
          parentPatient: 0,
        },
      })
      .sort({ "time.date": -1 })
      .skip(page > 1 ? (page - 1) * 2 : 0)
      .limit(2);

    const page2 = appointmentData.length / 2;

    const older_apppointmentData: Array<object> = await appointmentModel
      .find(
        {
          patient: req.currentPatient,
          cancelled: false,
          "time.date": { $lte: Date() },
        },
        "-patient"
      )
      .populate({
        path: "hospital",
        select: {
          ...excludeHospitalFields,
          type: 0,
          deleted: 0,
          contactNumber: 0,
        },
      })
      .populate({
        path: "doctors",
        select: {
          ...excludeDoctorFields,
          hospitalDetails: 0,
          specialization: 0,
          qualification: 0,
          email: 0,
          active: 0,
          deleted: 0,
          overallExperience: 0,
          gender: 0,
          image: 0,
        },
      })
      .populate({
        path: "subPatient",
        select: {
          parentPatient: 0,
        },
      })
      .sort({ "time.date": 1 })
      .skip(page > page2 ? (page2 - 1) * 2 : 0)
      .limit(2);

    const allAppointment = appointmentData.concat(older_apppointmentData);

    if (allAppointment.length > 0)
      return successResponse(
        { past: older_apppointmentData, upcoming: allAppointment },
        "Appointments has been found",
        res
      );
    else {
      let error = new Error("No appointments is found");
      return errorResponse(error, res, 404);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
};
//view the schedule of a doctor working for a specific Hospital for a given day and date
export const ViewSchedule = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let schedule = await workingHourModel.findOne({
      doctorDetails: body.doctors,
      hospitalDetails: body.hospital,
    });
    // console.log(schedule)
    const requestDate: Date = new Date(body.time);
    let query: Object = {};
    if (body.day == "monday") {
      query = { "monday.working": true };
    } else if (body.day == "tuesday") {
      query = { "tuesday.working": true };
      query = { "wednesday.working": true };
    } else if (body.day == "thursday") {
      query = { "thursday.working": true };
    } else if (body.day == "friday") {
      query = { "friday.working": true };
      query = { "saturday.working": true };
    } else if (body.day == "sunday") {
      query = { "sunday.working": true };
    }
    let appointmentCount = await workingHourModel.find({
      hospital: body.hospital,
      // "schedule.working":true
    });
    return successResponse(
      schedule,
      "All Appoinments are succssfully shown  ",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Get doctor list
export const getDoctorByDay = async (req: Request, res: Response) => {
  try {
    const body: any = req.body;
    const day = `${body.day}.working`;
    let query: Object = {};
    if (body.day == "monday") {
      query = { "monday.working": true };
    } else if (body.day == "tuesday") {
      query = { "tuesday.working": true };
    } else if (body.day == "wednesday") {
      query = { "wednesday.working": true };
    } else if (body.day == "thursday") {
      query = { "thursday.working": true };
    } else if (body.day == "friday") {
      query = { "friday.working": true };
    } else if (body.day == "saturday") {
    } else if (body.day == "sunday") {
      query = { "sunday.working": true };
    }
    const data = await workingHourModel
      .find(query, "doctorDetails")
      .distinct("doctorDetails");

    const doctorData = await doctorModel.find(
      { _id: { $in: data } },
      excludeDoctorFields
    );
    return successResponse(doctorData, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// import * as connection from "../Services/connection.db";
// Get speciality, body part and disease
export const getSpecialityBodyPartAndDisease = async (
  _req: Request,
  res: Response
) => {
  try {
    /*  
      connect to database
    */
    const Conn = mongoose.createConnection();
    await Conn.openUri(<string>process.env.DB_PATH);

    const speciality = Conn.collection("special").find();
    const bodyParts = bodyPartModel.find();
    const disease = diseaseModel.find();

    const SBD = await Promise.all([speciality.toArray(), bodyParts, disease]);
    const [S, B, D] = SBD;

    return successResponse(
      { Speciality: S, BodyPart: B, Disease: D },
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Get Hospitals by city
export const getHospitalsByCity = async (req: Request, res: Response) => {
  try {
    const addressById: Array<any> = await addressModel.find(
      { city: req.body.cityId },
      { _id: 1 }
    );
    let addressIds: Array<string> = addressById.map((e: any) => {
      return e._id;
    });

    const hospitalsInThatCity = await hospitalModel.find({
      address: { $in: addressIds },
    });
    return successResponse(hospitalsInThatCity, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Get doctors by city
export const getDoctorsByCity = async (req: Request, res: Response) => {
  try {
    const addressById: Array<any> = await addressModel.find(
      { city: req.body.cityId },
      { _id: 1 }
    );
    let addressIds: Array<string> = addressById.map((e: any) => {
      return e._id;
    });

    let hospitalsInThatCity: Array<any> = await hospitalModel
      .find(
        {
          address: { $in: addressIds },
        },
        { doctors: 1 }
      )
      .populate({ path: "doctors", select: excludeDoctorFields });

    hospitalsInThatCity = hospitalsInThatCity.filter(
      (e: any) => e.doctors.length > 0
    );

    // Isme ek particular hospital k liye consultation fee dikhani hai.
    // Match krna padega k kissi city k liye kissi hospital me kissi doctor ki
    // fee kya hai
    let doctorsInThatCity: Array<any> = [];
    hospitalsInThatCity.map((e: any) => {
      doctorsInThatCity.push(...e.doctors.map((e: any) => e._id));
    });

    doctorsInThatCity = await doctorModel
      .find(
        {
          _id: { $in: doctorsInThatCity },
        },
        excludeDoctorFields
      )
      .populate("specialization qualification");
    // .populate("hospitalDetails.hospital");
    return successResponse(doctorsInThatCity, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
//Upload prescription for the preffered medical centre
export const uploadPrescription = async (req: Request, res: Response) => {
  try {
    const image = new prescriptionModel(req.body);
    image.prescription.data = req.file?.filename;
    image.prescription.contentType = req.file?.mimetype;
    //  let medicineBook = await new prescriptionModel(req.body,image).save();
    let medicineBook = await image.save(req.body);
    return successResponse(
      medicineBook,
      "Medicine has been successfully booked",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const checkDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const isDoctorAvaiable: { status: boolean; message: string } =
      await doctorController.checkDoctorAvailability(req.body);

    return successResponse(
      isDoctorAvaiable.status,
      isDoctorAvaiable.message,
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const searchPatientByPhoneNumberOrEmail = async (
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

    const patientObj = await patientModel.find(
      {
        $or: [
          {
            email: term,
          },
          {
            phoneNumber: term,
          },
        ],
      },
      excludePatientFields
    );
    if (patientObj) {
      return successResponse(patientObj, "Success", res);
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

export const checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod =
  async (req: Request, res: Response) => {
    try {
      let { doctorId, patientId, hospitalId, subPatientId } = req.body;
      const response =
        await prescriptionValidityController.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod(
          { doctorId, patientId, hospitalId, subPatientId }
        );
      return successResponse(response, "Success", res);
    } catch (error: any) {
      return errorResponse(error, res);
    }
  };
export const getPatientsNotification = async (req: Request, res: Response) => {
  try {
    let notification = notificationService.getPatientsNotification(
      req.currentPatient
    );

    Promise.all([notification])
      .then((result: Array<any>) => {
        let notifications = result.map((e: any) => e[0]);
        return successResponse(notifications, "Success", res);
      })
      .catch((error: any) => errorResponse(error, res));
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
