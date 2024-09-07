import express, { NextFunction, Request, Response } from "express";
import { authenticatePatient } from "../authentication/Patient.auth";
import * as patientController from "../Controllers/Patient.Controller";
import * as paymentController from "../Controllers/AppointmentPayment.Controller";
import multer from "multer";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import * as subPatientController from "../Controllers/SubPatient.Controller";
import {
  patient,
  prescriptionValidity,
  subPatient,
} from "../Services/schemaNames";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { errorResponse, successResponse } from "../Services/response";

import * as feeService from "../Module/Payment/Service/Fee.Service";

const patientRouter = express.Router();
const upload = multer({ dest: "./src/uploads" });
patientRouter.post("/login", patientController.patientLogin);
patientRouter.post("/", patientController.createPatient);
patientRouter.get(
  "/",
  oneOf(authenticatePatient),
  patientController.getAllPatientsList
);
patientRouter.post(
  "/getPatientById/:id",
  oneOf(authenticatePatient),
  patientController.getPatientById
);
patientRouter.post(
  "/updateProfile",
  oneOf(authenticatePatient),
  patientController.updatePatientProfile
);
patientRouter.post(
  "/deleteProfile",
  oneOf(authenticatePatient),
  patientController.deleteProfile
);

import * as prescriptionValidtiyService from "../Controllers/Prescription-Validity.Controller";
import patientModel from "../Models/Patient.Model";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import doctorModel from "../Models/Doctors.Model";
import hospitalModel from "../Models/Hospital.Model";
import {
  digiMilesSMS,
  formatTimings,
  sendNotificationToDoctor,
  sendNotificationToHospital,
  sendNotificationToPatient,
} from "../Services/Utils";
import moment from "moment";
import subPatientModel from "../Models/SubPatient.Model";
import { AppointmentType } from "../Services/Helpers";


// Deprecated - View hospital/verifyPayment
patientRouter.post(
  "/BookAppointment",
  oneOf(authenticatePatient, authenticateHospital),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // let doctorId = req.body.doctors,
      //   patientId = req.body.patient,
      //   hospitalId = req.body.hospital,
      //   subPatientId = req.body.subPatient;
      // let valid =
      //   await prescriptionValidtiyService.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod(
      //     { doctorId, patientId, hospitalId, subPatientId }
      //   );
      // req.body["appointmentType"] = valid ? "Follow up" : "Fresh";
      let appointmentType;
      switch (req.body?.appointmentType) {
        case AppointmentType.FRESH: {
          appointmentType = AppointmentType.FRESH
          break;
        }

        case AppointmentType.FOLLOW_UP: {
          appointmentType = AppointmentType.FOLLOW_UP
          break
        }

        default: {
          const error = new Error("error")
          error.message = "Invalid appointmentType value";
          throw error
        }
      }


      req.body["appointmentType"] = appointmentType
      next();
    } catch (error: any) {
      return errorResponse(error, res);
    }
  },
  patientController.BookAppointment
);
patientRouter.post(
  "/rescheduleAppointment",
  oneOf(authenticatePatient),
  patientController.rescheduleAppointment
);
patientRouter.post(
  "/CancelAppointment",
  oneOf(authenticatePatient, authenticateHospital),
  patientController.CancelAppointment
);
patientRouter.post(
  "/doneAppointment",
  oneOf(authenticatePatient),
  patientController.doneAppointment
);
patientRouter.put(
  "/viewAppointById/:id",
  oneOf(authenticateDoctor, authenticateHospital, authenticatePatient),
  patientController.viewAppointById
);
patientRouter.post(
  "/getDoctorByDay",
  oneOf(authenticatePatient),
  patientController.getDoctorByDay
);

patientRouter.post(
  "/generateOrderId",
  oneOf(authenticatePatient, authenticateHospital, authenticateSuvedha),
  paymentController.generateOrderId
);
patientRouter.post(
  "/verifyPayment",
  oneOf(authenticatePatient, authenticateSuvedha),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let doctorId = req.body.appointment.doctors,
        patientId = req.body.appointment.patient,
        hospitalId = req.body.appointment.hospital,
        subPatientId = req.body.appointment.subPatient;
      let valid =
        await prescriptionValidtiyService.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod(
          { doctorId, patientId, hospitalId, subPatientId }
        );
      req.body["appointmentType"] = valid ? "Follow up" : "Fresh";

      if (req.currentPatient) {
        req.body.appointment["appointmentBookedBy"] = "Patient";
      } else if (req.currentSuvedha) {
        req.body.appointment["appointmentBookedBy"] = "Suvedha";
      }
      next();

      const body = "You have a new appoitment";
      const title = "New appointment";
      const notification = { body, title };

      const doctorData = doctorModel.findOne({ _id: doctorId });
      const hospitalData = hospitalModel.findOne({ _id: hospitalId });
      const patientData = patientModel.findOne({ _id: patientId });

      let arr = [doctorData, hospitalData, patientData];

      let subpatientData: any;
      if (subPatientId) {
        subpatientData = subPatientModel.findOne({ _id: subPatientId });
      }

      subPatientId && arr.push(subpatientData);

      Promise.all(arr).then((result) => {
        const [D, H, P, SP] = result;

        const doctorFirebaseToken = D.firebaseToken,
          hospitalFirebaseToken = H.firebaseToken,
          patientFirebaseToken = P.firebaseToken;

        sendNotificationToDoctor(doctorFirebaseToken, {
          title: "New appointment",
          body: `${P.firstName} ${P.lastName} has booked an appointment at ${H.name
            } and ${moment(req.body.appointment.time.date).format(
              "DD-MM-YYYY"
            )} ${formatTimings(req.body.appointment.time.from.time)}:${formatTimings(req.body.appointment.time.from.division)
            } -${formatTimings(req.body.appointment.time.till.time)}:${formatTimings(req.body.appointment.time.till.division)
            } `,
        });
        sendNotificationToHospital(hospitalFirebaseToken, {
          title: "New appointment",
          body: `${P.firstName} ${P.lastName} has booked an appointment with ${D.firstName
            } ${D.lastName} and ${moment(req.body.appointment.time.date).format(
              "DD-MM-YYYY"
            )} ${formatTimings(req.body.appointment.time.from.time)}:${formatTimings(req.body.appointment.time.from.division)
            } -${formatTimings(req.body.appointment.time.till.time)}:${formatTimings(req.body.appointment.time.till.division)
            } `,
        });

        sendNotificationToPatient(patientFirebaseToken, {
          title: "New appointment",
          body: `${P.firstName} ${P.lastName} has booked an appointment for ${D.firstName
            } ${D.lastName} at ${H.name} and ${moment(
              req.body.appointment.time.date
            ).format("DD-MM-YYYY")} ${req.body.appointment.time.from.time}:${req.body.appointment.time.from.division
            } -${req.body.appointment.time.till.time}:${req.body.appointment.time.till.division
            } `,
        });

        let name = `${P.firstName} ${P.lastName}`;

        if (SP) {
          name = `${SP.firstName} ${SP.lastName}`;
        }

        digiMilesSMS.sendAppointmentConfirmationNotification(
          P.phoneNumber,
          name,
          `${D.firstName} ${D.lastName}`,
          H.name,
          moment(req.body.appointment.time.date).format("DD-MM-YYYY"),
          `${req.body.appointment.time.from.time}:${req.body.appointment.time.from.division} -${req.body.appointment.time.till.time}:${req.body.appointment.time.till.division}`
        );
      });
    } catch (error: any) {
      return errorResponse(error, res);
    }
  },
  paymentController.verifyPayment
);
patientRouter.get(
  "/viewAppointment/:page",
  oneOf(authenticatePatient),
  patientController.ViewAppointment
);

// Get all the entities of filter
patientRouter.get(
  "/getSpecialityBodyPartAndDisease",
  patientController.getSpecialityBodyPartAndDisease
);

// Get hospitals by city
patientRouter.post(
  "/getHospitalsByCity",
  oneOf(authenticatePatient),
  patientController.getHospitalsByCity
);

// Get doctors by city
patientRouter.post(
  "/getDoctorsByCity",
  oneOf(authenticatePatient, authenticateSuvedha),
  patientController.getDoctorsByCity
);
//upload prescription
patientRouter.post(
  "/uploadPrescription",
  upload.single("prescription"),
  authenticatePatient,
  patientController.uploadPrescription
);

// Sub Patient
patientRouter.post(
  "/addSubPatient",
  oneOf(authenticatePatient),
  // subPatientController.addSubPatient
  patientController.createPatient
);

patientRouter.get(
  "/getSubPatientList",
  oneOf(authenticatePatient),
  subPatientController.getSubPatientList
);

patientRouter.put(
  "/deleteSubPatient/:id",
  oneOf(authenticatePatient),
  // subPatientController.deleteSubPatient
  patientController.deleteProfile
);

patientRouter.get(
  "/getSubPatientById/:id",
  oneOf(authenticatePatient),
  // subPatientController.getSubPatientById
  patientController.getPatientById
);

patientRouter.put(
  "/updateSubPatient/:id",
  oneOf(authenticatePatient),
  // subPatientController.updateSubPatient
  patientController.updatePatientProfile
);

// Check kro k doctor available hai uss din
patientRouter.post(
  "/checkDoctorAvailability",
  oneOf(authenticateDoctor, authenticatePatient, authenticateSuvedha),
  patientController.checkDoctorAvailability
);

// Search patient
patientRouter.get(
  "/searchPatientByPhoneNumberOrEmail/:term",
  oneOf(
    authenticateDoctor,
    authenticatePatient,
    authenticateHospital,
    authenticateSuvedha
  ),
  patientController.searchPatientByPhoneNumberOrEmail
);

patientRouter.put(
  "/checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod",
  oneOf(authenticatePatient),
  patientController.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod
);

patientRouter.get(
  "/getPatientsNotification",
  oneOf(authenticatePatient),
  patientController.getPatientsNotification
);

patientRouter.get(
  "/getFees",
  oneOf(authenticatePatient),
  async (req: Request, res: Response) => {
    try {
      let data = await feeService.getAllFees({ name: "Convenience Fee" });
      return successResponse(data, "Success", res);
    } catch (error: any) {
      return errorResponse(error, res);
    }
  }
);

patientRouter.post(
  "/checkIfDoctorIsOnHoliday",
  oneOf(authenticatePatient, authenticateHospital, authenticateDoctor),
  patientController.checkIfDoctorIsOnHoliday
);

patientRouter.post(
  "/canDoctorTakeAppointment",
  oneOf(authenticatePatient, authenticateHospital),
  patientController.canDoctorTakeAppointment
);

patientRouter.get(
  "/getMyLikes/:id",
  oneOf(authenticatePatient),
  patientController.getDoctorsIHaveLikes
);

patientRouter.put("/verify/number", oneOf(authenticatePatient), patientController.verifyPatientPhoneNumber)

export default patientRouter;
