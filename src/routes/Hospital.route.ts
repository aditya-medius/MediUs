import express, { NextFunction, Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { authenticatePatient } from "../authentication/Patient.auth";
import {
  approveDoctorRequest,
  denyDoctorRequest,
  requestApprovalFromDoctor,
} from "../Controllers/Approval-Request.Controller";
import * as hospitalController from "../Controllers/Hospital.Controller";
import {
  createWorkingHours,
  createOpeningHours,
} from "../Controllers/WorkingHours.Controller";
import { checkHospitalsApprovalStatus } from "../Services/Approval-Request/Approval-Request.Service";
import { oneOf } from "../Services/middlewareHelper";
import { errorResponse, successResponse } from "../Services/response";
import * as feeService from "../Module/Payment/Service/Fee.Service";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import { checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod } from "../Controllers/Prescription-Validity.Controller";
const hospitalRouter = express.Router();

hospitalRouter.get(
  "/",
  // oneOf(authenticateHospital),
  hospitalController.getAllHospitalsList
);
hospitalRouter.post("/login", hospitalController.login);
hospitalRouter.post("/loginWithPassword", hospitalController.loginWithPassword);

hospitalRouter.get(
  "/myHospital",
  authenticateHospital,
  hospitalController.myHospital
);

// hospitalRouter.get("/", authenticateHospital, hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);
hospitalRouter.post(
  "/deleteHospital",
  oneOf(authenticateHospital),
  hospitalController.deleteHospital
);
hospitalRouter.post(
  "/updateHospital",
  oneOf(authenticateHospital),
  // async (req: Request, res: Response, next: NextFunction) => {
  //   let { doctors } = req.body;
  //   if (doctors) {
  //     try {
  //       let doctorId = doctors[0],
  //         hospitalId = req.currentHospital;
  //       let response = await checkHospitalsApprovalStatus(doctorId, hospitalId);
  //       switch (response) {
  //         case "Pending": {
  //           return successResponse({}, "Your request is pending", res);
  //         }
  //         case "Denied": {
  //           return successResponse(
  //             {},
  //             "Your request for this doctor is denied",
  //             res
  //           );
  //         }
  //         case "Approved": {
  //           next();
  //         }
  //       }
  //     } catch (error: any) {
  //       return errorResponse(error, res);
  //     }
  //   }
  // },
  hospitalController.updateHospital
);

hospitalRouter.post(
  "/anemity",
  oneOf(authenticateHospital),
  hospitalController.createHospitalAnemity
);
hospitalRouter.get("/getAnemities", hospitalController.getAnemities);
hospitalRouter.get("/getServices", hospitalController.getServices);
// hospitalRouter.post("/speciality",oneOf(authenticateHospital),hospitalController.addHospitalSpeciality);

hospitalRouter.get(
  "/findHospitalBySpecialityOrBodyPart/:term",
  hospitalController.searchHospital
);

//ADD DOCTOR TO THE HOSPITAL
hospitalRouter.post(
  "/removeDoctor",
  oneOf(authenticateHospital),
  hospitalController.removeDoctor
);

//View Appointments

hospitalRouter.get(
  "/viewAppointment/:page",
  oneOf(authenticateHospital),
  hospitalController.viewAppointment
);

// Get hospital by id
hospitalRouter.put(
  "/getHospitalById/:id",
  oneOf(
    authenticatePatient,
    authenticateDoctor,
    authenticateHospital,
    authenticateSuvedha
  ),
  hospitalController.getHospitalById
);

// Hospital opening hours
hospitalRouter.post("/createOpeningHours", createOpeningHours);

// hospital me kaam krne waale doctors
hospitalRouter.get(
  "/getDoctorsInHospital",
  oneOf(authenticateHospital),
  hospitalController.getDoctorsInHospital
);

hospitalRouter.post(
  "/getAppointmentByDate",
  oneOf(authenticateHospital),
  hospitalController.getAppointmentByDate
);

hospitalRouter.put(
  "/checkVerificationStatus",
  hospitalController.checkVerificationStatus
);

/* Doctor se approval ki request */
hospitalRouter.put(
  "/requestApprovalFromDoctor",
  oneOf(authenticateHospital),
  requestApprovalFromDoctor
);

/* Doctor k approval ki request approve kro */
hospitalRouter.put(
  "/approveDoctorRequest",
  oneOf(authenticateHospital),
  approveDoctorRequest
);

hospitalRouter.put(
  "/denyDoctorRequest",
  oneOf(authenticateHospital),
  denyDoctorRequest
);

/* Hospital ko kitno ne approval k liye request ki hai */
hospitalRouter.put(
  "/getListOfRequestedApprovals_OfHospital",
  oneOf(authenticateHospital),
  hospitalController.getListOfRequestedApprovals_OfHospital
);

/* Hospital ne kitno se approval ki request ki hai */
hospitalRouter.put(
  "/getListOfRequestedApprovals_ByHospital",
  oneOf(authenticateHospital),
  hospitalController.getListOfRequestedApprovals_ByHospital
);

/* Doctors ki offline aur online appointment */
hospitalRouter.post(
  "/getDoctorsOfflineAndOnlineAppointments",
  oneOf(authenticateHospital),
  hospitalController.getDoctorsOfflineAndOnlineAppointments
);

/* Hospital k liye notifications */
hospitalRouter.get(
  "/getHospitalsNotification",
  oneOf(authenticateHospital),
  hospitalController.getHospitalsNotification
);

/* Update hospital Address */
hospitalRouter.put(
  "/updateHospitalAddress",
  oneOf(authenticateHospital),
  hospitalController.updateHospitalAddress
);

hospitalRouter.put(
  "/getHospitalsSpecilization_AccordingToDoctor",
  oneOf(authenticateHospital, authenticatePatient),
  hospitalController.getHospitalsSpecilization_AccordingToDoctor
);
hospitalRouter.put(
  "/getDoctorsListInHospital_withApprovalStatus",
  oneOf(authenticateHospital),
  hospitalController.getDoctorsListInHospital_withApprovalStatus
);

hospitalRouter.get(
  "/searchHospitalByPhoneNumber/:term",
  oneOf(authenticateHospital, authenticateDoctor, authenticatePatient),
  hospitalController.searchHospitalByPhoneNumber
);

hospitalRouter.get(
  "/getFees",
  oneOf(authenticateHospital, authenticateDoctor),
  async (req: Request, res: Response) => {
    try {
      let data = await feeService.getAllFees();
      return successResponse(data, "Success", res);
    } catch (error: any) {
      return errorResponse(error, res);
    }
  }
);

hospitalRouter.put(
  "/getPatientsAppointmentsInThisHospital/:page",
  oneOf(authenticateHospital),
  hospitalController.getPatientsAppointmentsInThisHospital
);

hospitalRouter.post(
  "/verifyPayment",
  oneOf(authenticateHospital),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let doctorId = req.body.doctors,
        patientId = req.body.patient,
        hospitalId = req.body.hospital,
        subPatientId = req.body.subPatient;
      let valid =
        await checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod({
          doctorId,
          patientId,
          hospitalId,
          subPatientId,
        });
      req.body["appointmentType"] = valid ? "Follow up" : "Fresh";

      if (req.currentHospital) {
        req.body.appointment["appointmentBookedBy"] = "Hospital";
      }

      next();
    } catch (error: any) {
      return errorResponse(error, res);
    }
  },

  hospitalController.verifyPayment
);
hospitalRouter.post(
  "/generateOrderId",
  oneOf(authenticateHospital),
  hospitalController.generateOrderId
);

hospitalRouter.put(
  "/doctors/in/hospital",
  // oneOf(authenticateHospital),
  hospitalController.doctorsInHospitalWithTimings
);

hospitalRouter.get(
  "/getHospitalDetails/:id",
  oneOf(authenticateHospital),
  hospitalController.getHospitalDetails
);

hospitalRouter.post(
  "/updateNumber",
  oneOf(authenticateHospital),
  hospitalController.sendOTPToUpdateNumber
);

hospitalRouter.put(
  "/verify/updateNumber",
  oneOf(authenticateHospital),
  hospitalController.verifyOTPToUpdateNumber
);

export default hospitalRouter;
