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

hospitalRouter.post(
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
hospitalRouter.get(
  "/getHospitalById/:id",
  oneOf(authenticatePatient, authenticateDoctor, authenticateHospital),
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

export default hospitalRouter;
