import express, { NextFunction, Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
// import * as doctorController from "../Controllers/Doctor.Controller";
import * as doctorController from "../Controllers/Doctor.Controller";
import * as qualificationController from "../Controllers/Qualification.Controller";
import * as workingHoursController from "../Controllers/WorkingHours.Controller";
import { authenticatePatient } from "../authentication/Patient.auth";
import { oneOf } from "../Services/middlewareHelper";
import * as preferredPharmaController from "../Controllers/Pharma.Cotroller";
import * as kycController from "../Controllers/KYC.Controller";
import { authenticateHospital } from "../authentication/Hospital.auth";
import * as mediaController from "../Controllers/Media.Controller";
import multer from "multer";
import * as path from "path";
import { authenticateAdmin } from "../authentication/Admin.auth";
import {
  checkDoctorsApprovalStatus,
  checkHospitalsApprovalStatus,
  getListOfRequestedApprovals_OfDoctor,
} from "../Services/Approval-Request/Approval-Request.Service";
import { errorResponse, successResponse } from "../Services/response";
import {
  approveHospitalRequest,
  denyHospitalRequest,
  requestApprovalFromHospital,
} from "../Controllers/Approval-Request.Controller";
import { setConsultationFeeForDoctor } from "../Services/Doctor/Doctor.Service";
import { setPrescriptionValidity } from "../Controllers/Prescription-Validity.Controller";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/user");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

const doctorRouter = express.Router();

doctorRouter.post("/login", doctorController.doctorLogin);

/*
  Doctor profile creation routes - START
*/
doctorRouter.put(
  "/addDoctorQualification",
  qualificationController.addDoctorQualification
);
doctorRouter.put(
  "/addDoctorWorkingHour",
  oneOf(authenticateDoctor),
  workingHoursController.createWorkingHours
);
doctorRouter.post("/", doctorController.createDoctor);
/*
  Doctor profile creation routes - END
*/

doctorRouter.get("/", doctorController.getAllDoctorsList);
doctorRouter.post(
  "/getDoctorById/:id",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.getDoctorById
);
doctorRouter.get(
  "/getHospitalListByDoctorId/:id",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.getHospitalListByDoctorId
);
doctorRouter.post(
  "/updateProfile",
  oneOf(authenticateDoctor),
  // async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     let { hospitalDetails } = req.body;
  //     if (hospitalDetails) {
  //       let hospitalId = hospitalDetails[0].hospital,
  //         doctorId = req.currentDoctor;
  //       let response = await checkDoctorsApprovalStatus(doctorId, hospitalId);
  //       switch (response) {
  //         case "Pending": {
  //           return successResponse({}, "Your request is pending", res);
  //         }
  //         case "Denied": {
  //           return successResponse(
  //             {},
  //             "Your request for this hospital is denied",
  //             res
  //           );
  //         }
  //         case "Approved": {
  //           next();
  //         }
  //       }
  //     }
  //   } catch (error: any) {
  //     return errorResponse(error, res);
  //   }
  // },
  doctorController.updateDoctorProfile
);
doctorRouter.delete(
  "/deleteProfile",
  oneOf(authenticateDoctor),
  doctorController.deleteProfile
);

doctorRouter.get(
  "/findDoctorBySpecialityOrBodyPart/:term",
  oneOf(authenticateDoctor, authenticatePatient, authenticateSuvedha),
  doctorController.searchDoctor
);
doctorRouter.get(
  "/searchDoctorByPhoneNumberOrEmail/:term",
  oneOf(authenticateDoctor, authenticatePatient, authenticateHospital),
  doctorController.searchDoctorByPhoneNumberOrEmail
);

doctorRouter.put(
  "/setSchedule",
  oneOf(authenticateDoctor, authenticateHospital),
  // doctorController.setSchedule
  (req: Request, res: Response, next: NextFunction) => {
    let data: any = {};
    req.body.workingHour.forEach((e: any) => {
      data[e.name] = {
        capacity: e.capacity,
        till: e.till,
        from: e.from,
        working: e.working,
      };
    });
    req.body.workingHour = { ...data };
    next();
  },
  workingHoursController.createWorkingHours
);

doctorRouter.put(
  "/updateWorkingHour",
  oneOf(authenticateDoctor),
  // doctorController.setSchedule
  workingHoursController.updateWorkingHour
);

// Get Doctor's appointment
doctorRouter.get(
  "/viewAppointments/:page",
  oneOf(authenticateDoctor),
  doctorController.viewAppointments
);
doctorRouter.post(
  "/viewAppointmentsByDate/:page",
  oneOf(authenticateDoctor),
  doctorController.viewAppointmentsByDate
);

// Cancel doctor's appointments
doctorRouter.put(
  "/cancelAppointments",
  oneOf(authenticateDoctor),
  doctorController.cancelAppointments
);

doctorRouter.put(
  "/getDoctorWorkingInHospitals/:id",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.getDoctorWorkingInHospitals
);
doctorRouter.post(
  "/getWorkingHours",
  oneOf(authenticateDoctor, authenticatePatient, authenticateHospital),
  workingHoursController.getWorkingHours
);

//Preferred Pharma Routes
//add the preferred pharma
doctorRouter.post(
  "/addPharma",
  authenticateDoctor,
  preferredPharmaController.addPharma
);

//get all Pharma
doctorRouter.get("/getPharma", preferredPharmaController.getPharma);

//delete the pharma using id
doctorRouter.post(
  "/delPharma/:id",
  authenticateDoctor,
  preferredPharmaController.delPharma
);

//update the pharma
doctorRouter.post(
  "/updatePharma/:id",
  authenticateDoctor,
  preferredPharmaController.updatePharma
);

// KYC details
doctorRouter.post("/setKYC", kycController.addKYC);
doctorRouter.post("/updateKyc", kycController.updateKyc);

// Media
doctorRouter.post(
  "/uploadImage",
  oneOf(
    authenticateDoctor,
    authenticateHospital,
    authenticatePatient,
    authenticateAdmin
  ),
  upload.single("profileImage"),
  (req: Request, res: Response) => {
    mediaController.uploadImage(req, res);
  }
);

// Doctors ki kamayi
doctorRouter.get(
  "/getTotalEarnings",
  oneOf(authenticateDoctor),
  doctorController.getTotalEarnings
);

// Account se paise nikalna
doctorRouter.post(
  "/withdraw",
  oneOf(authenticateDoctor),
  doctorController.withdraw
);

// Balance check kro account me
doctorRouter.get(
  "/getPendingAmount",
  oneOf(authenticateDoctor),
  doctorController.getPendingAmount
);

// kitni appointment bachi hai, poori ho gayi hai aur cancel ho gayi hai. Uska data
doctorRouter.get(
  "/appointmentSummary",
  oneOf(authenticateDoctor),
  doctorController.getAppointmentSummary
);

// doctor ki specialization or qualification ko delete
doctorRouter.delete(
  "/deleteSpecializationAndQualification",
  oneOf(authenticateDoctor),
  doctorController.deleteSpecializationAndQualification
);
doctorRouter.delete(
  "/deleteHospitalFromDoctor",
  oneOf(authenticateDoctor),
  doctorController.deleteHospitalFromDoctor
);

doctorRouter.put(
  "/updateQualification/:qualificationId",
  oneOf(authenticateDoctor),
  doctorController.updateQualification
);

doctorRouter.put(
  "/checkVerificationStatus",
  doctorController.checkVerificationStatus
);

/* Hospital khud ko doctor ki profile me add kr ske */
doctorRouter.post(
  "/addHospitalInDoctorProfile",
  oneOf(authenticateHospital),
  // async (req: Request, res: Response, next: NextFunction) => {
  //   let { doctorId } = req.body,
  //     hospitalId = req.currentHospital;

  //   try {
  //     let response = await checkHospitalsApprovalStatus(doctorId, hospitalId);

  //     switch (response) {
  //       case "Pending": {
  //         return successResponse({}, "Your request is pending", res);
  //       }
  //       case "Denied": {
  //         return successResponse(
  //           {},
  //           "Your request for this doctor is denied",
  //           res
  //         );
  //       }
  //       case "Approved": {
  //         next();
  //       }
  //     }
  //   } catch (error: any) {
  //     return errorResponse(error, res);
  //   }
  // },
  doctorController.addHospitalInDoctorProfile
);

/* Qualification List */
doctorRouter.get(
  "/getQualificationList",
  // oneOf(authenticateDoctor),
  qualificationController.getQualificationList
);

doctorRouter.put(
  "/requestApprovalFromHospital",
  oneOf(authenticateDoctor),
  requestApprovalFromHospital
);

doctorRouter.put(
  "/approveHospitalRequest",
  oneOf(authenticateDoctor),
  approveHospitalRequest
);

doctorRouter.put(
  "/denyHospitalRequest",
  oneOf(authenticateDoctor),
  denyHospitalRequest
);

doctorRouter.put(
  "/setConsultationFeeForDoctor",
  oneOf(authenticateDoctor, authenticateHospital),
  doctorController.setConsultationFeeForDoctor
);

/* Doctor ko kitno ne approval k liye request ki hai  */
doctorRouter.put(
  "/getListOfRequestedApprovals_OfDoctor",
  oneOf(authenticateDoctor),
  doctorController.getListOfRequestedApprovals_OfDoctor
);

/* Doctor ne kitno se approval ki request ki hai */
doctorRouter.put(
  "/getListOfRequestedApprovals_ByDoctor",
  oneOf(authenticateDoctor),
  doctorController.getListOfRequestedApprovals_ByDoctor
);

/* Doctor ka presciprtion validity */
doctorRouter.put(
  "/setPrescriptionValidity",
  oneOf(authenticateDoctor, authenticateHospital),
  setPrescriptionValidity
);

/* Doctors ki offline aur online appointment */
doctorRouter.get(
  "/getDoctorsOfflineAndOnlineAppointments",
  oneOf(authenticateDoctor),
  doctorController.getDoctorsOfflineAndOnlineAppointments
);

/* Doctors k liye kya notification hai */
doctorRouter.get(
  "/getDoctorsNotification",
  oneOf(authenticateDoctor),
  doctorController.getDoctorsNotification
);

doctorRouter.post(
  "/setHolidayCalendar",
  oneOf(authenticateDoctor, authenticateHospital),
  doctorController.setHolidayCalendar
);
doctorRouter.put(
  "/getDoctorsHolidayList",
  oneOf(authenticateDoctor, authenticateHospital),
  doctorController.getDoctorsHolidayList
);
doctorRouter.put(
  "/deleteHolidayCalendar",
  oneOf(authenticateDoctor),
  doctorController.deleteHolidayCalendar
);

doctorRouter.post(
  "/getHospitalsOfflineAndOnlineAppointments",
  oneOf(authenticateDoctor),
  doctorController.getHospitalsOfflineAndOnlineAppointments
);
doctorRouter.post(
  "/getListOfAllAppointments/:page",
  oneOf(authenticateDoctor),
  doctorController.getListOfAllAppointments
);

doctorRouter.put(
  "/deleteWorkingHour",
  oneOf(authenticateDoctor, authenticateHospital),
  workingHoursController.deleteWorkingHour
);

doctorRouter.get(
  "/getAppointmentFeeFromAppointmentId/:appointmentId",
  oneOf(authenticateDoctor),
  doctorController.getAppointmentFeeFromAppointmentId
);
doctorRouter.put(
  "/getFeeAndValidity",
  oneOf(authenticateDoctor, authenticateHospital),
  doctorController.getPrescriptionValidityAndFeesOfDoctorInHospital
);
doctorRouter.post(
  "/likeUnlikeDoctor",
  oneOf(authenticateDoctor, authenticatePatient, authenticateSuvedha),
  doctorController.likeADoctor
);
doctorRouter.post(
  "/unlikeDoctor",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.unlikeDoctor
);

doctorRouter.post(
  "/getMyLikes",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.getMyLikes
);
export default doctorRouter;
