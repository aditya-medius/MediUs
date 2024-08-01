"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Doctor_auth_1 = require("../authentication/Doctor.auth");
// import * as doctorController from "../Controllers/Doctor.Controller";
const doctorController = __importStar(require("../Controllers/Doctor.Controller"));
const qualificationController = __importStar(require("../Controllers/Qualification.Controller"));
const workingHoursController = __importStar(require("../Controllers/WorkingHours.Controller"));
const Patient_auth_1 = require("../authentication/Patient.auth");
const middlewareHelper_1 = require("../Services/middlewareHelper");
const preferredPharmaController = __importStar(require("../Controllers/Pharma.Cotroller"));
const kycController = __importStar(require("../Controllers/KYC.Controller"));
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const mediaController = __importStar(require("../Controllers/Media.Controller"));
const multer_1 = __importDefault(require("multer"));
const path = __importStar(require("path"));
const Admin_auth_1 = require("../authentication/Admin.auth");
const Approval_Request_Controller_1 = require("../Controllers/Approval-Request.Controller");
const Prescription_Validity_Controller_1 = require("../Controllers/Prescription-Validity.Controller");
const Suvedha_auth_1 = require("../authentication/Suvedha.auth");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/user");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const doctorRouter = express_1.default.Router();
doctorRouter.post("/login", doctorController.doctorLogin);
/*
  Doctor profile creation routes - START
*/
doctorRouter.put("/addDoctorQualification", qualificationController.addDoctorQualification);
doctorRouter.put("/addDoctorWorkingHour", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), workingHoursController.createWorkingHours);
doctorRouter.post("/", doctorController.createDoctor);
/*
  Doctor profile creation routes - END
*/
doctorRouter.get("/", doctorController.getAllDoctorsList);
doctorRouter.post("/getDoctorById/:id", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient, Admin_auth_1.authenticateAdmin), doctorController.getDoctorById);
doctorRouter.get("/getHospitalListByDoctorId/:id", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), doctorController.getHospitalListByDoctorId);
doctorRouter.post("/updateProfile", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), 
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
doctorController.updateDoctorProfile);
doctorRouter.delete("/deleteProfile", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.deleteProfile);
doctorRouter.get("/findDoctorBySpecialityOrBodyPart/:term", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient, Suvedha_auth_1.authenticateSuvedha), doctorController.searchDoctor);
doctorRouter.get("/searchDoctorByPhoneNumberOrEmail/:term", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital), doctorController.searchDoctorByPhoneNumberOrEmail);
doctorRouter.put("/setSchedule", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), 
// doctorController.setSchedule
(req, res, next) => {
    let data = {};
    req.body.workingHour.forEach((e) => {
        data[e.name] = {
            capacity: e.capacity,
            till: e.till,
            from: e.from,
            working: e.working,
        };
    });
    req.body.workingHour = Object.assign({}, data);
    next();
}, workingHoursController.createWorkingHours);
doctorRouter.put("/updateWorkingHour", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), 
// doctorController.setSchedule
workingHoursController.updateWorkingHour);
// Get Doctor's appointment
doctorRouter.get("/viewAppointments/:page", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.viewAppointments);
doctorRouter.post("/viewAppointmentsByDate/:page", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.viewAppointmentsByDate);
// Cancel doctor's appointments
doctorRouter.put("/cancelAppointments", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.cancelAppointments);
doctorRouter.put("/getDoctorWorkingInHospitals/:id", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), doctorController.getDoctorWorkingInHospitals);
doctorRouter.post("/getWorkingHours", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital), workingHoursController.getWorkingHours);
//Preferred Pharma Routes
//add the preferred pharma
doctorRouter.post("/addPharma", Doctor_auth_1.authenticateDoctor, preferredPharmaController.addPharma);
//get all Pharma
doctorRouter.get("/getPharma", preferredPharmaController.getPharma);
//delete the pharma using id
doctorRouter.post("/delPharma/:id", Doctor_auth_1.authenticateDoctor, preferredPharmaController.delPharma);
//update the pharma
doctorRouter.post("/updatePharma/:id", Doctor_auth_1.authenticateDoctor, preferredPharmaController.updatePharma);
// KYC details
doctorRouter.post("/setKYC", kycController.addKYC);
doctorRouter.post("/updateKyc", kycController.updateKyc);
// Media
doctorRouter.post("/uploadImage", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient, Admin_auth_1.authenticateAdmin), upload.single("profileImage"), (req, res) => {
    mediaController.uploadImage(req, res);
});
// Doctors ki kamayi
doctorRouter.get("/getTotalEarnings", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getTotalEarnings);
// Account se paise nikalna
doctorRouter.post("/withdraw", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.withdraw);
// Balance check kro account me
doctorRouter.get("/getPendingAmount", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getPendingAmount);
// kitni appointment bachi hai, poori ho gayi hai aur cancel ho gayi hai. Uska data
doctorRouter.get("/appointmentSummary", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getAppointmentSummary);
// doctor ki specialization or qualification ko delete
doctorRouter.delete("/deleteSpecializationAndQualification", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.deleteSpecializationAndQualification);
doctorRouter.delete("/deleteHospitalFromDoctor", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.deleteHospitalFromDoctor);
doctorRouter.put("/updateQualification/:qualificationId", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.updateQualification);
doctorRouter.put("/checkVerificationStatus", doctorController.checkVerificationStatus);
/* Hospital khud ko doctor ki profile me add kr ske */
doctorRouter.post("/addHospitalInDoctorProfile", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), 
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
doctorController.addHospitalInDoctorProfile);
/* Qualification List */
doctorRouter.get("/getQualificationList", 
// oneOf(authenticateDoctor),
qualificationController.getQualificationList);
doctorRouter.put("/requestApprovalFromHospital", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), Approval_Request_Controller_1.requestApprovalFromHospital);
doctorRouter.put("/approveHospitalRequest", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), Approval_Request_Controller_1.approveHospitalRequest);
doctorRouter.put("/denyHospitalRequest", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), Approval_Request_Controller_1.denyHospitalRequest);
doctorRouter.put("/setConsultationFeeForDoctor", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.setConsultationFeeForDoctor);
/* Doctor ko kitno ne approval k liye request ki hai  */
doctorRouter.put("/getListOfRequestedApprovals_OfDoctor", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getListOfRequestedApprovals_OfDoctor);
/* Doctor ne kitno se approval ki request ki hai */
doctorRouter.put("/getListOfRequestedApprovals_ByDoctor", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getListOfRequestedApprovals_ByDoctor);
/* Doctor ka presciprtion validity */
doctorRouter.put("/setPrescriptionValidity", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), Prescription_Validity_Controller_1.setPrescriptionValidity);
/* Doctors ki offline aur online appointment */
doctorRouter.get("/getDoctorsOfflineAndOnlineAppointments", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getDoctorsOfflineAndOnlineAppointments);
/* Doctors k liye kya notification hai */
doctorRouter.get("/getDoctorsNotification", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getDoctorsNotification);
doctorRouter.post("/setHolidayCalendar", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.setHolidayCalendar);
doctorRouter.put("/getDoctorsHolidayList", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.getDoctorsHolidayList);
doctorRouter.put("/deleteHolidayCalendar", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.deleteHolidayCalendar);
doctorRouter.post("/getHospitalsOfflineAndOnlineAppointments", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getHospitalsOfflineAndOnlineAppointments);
doctorRouter.post("/getListOfAllAppointments/:page", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getListOfAllAppointments);
doctorRouter.put("/deleteWorkingHour", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), workingHoursController.deleteWorkingHour);
doctorRouter.get("/getAppointmentFeeFromAppointmentId/:appointmentId", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getAppointmentFeeFromAppointmentId);
doctorRouter.put("/getFeeAndValidity", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.getPrescriptionValidityAndFeesOfDoctorInHospital);
doctorRouter.post("/likeUnlikeDoctor", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient, Suvedha_auth_1.authenticateSuvedha), doctorController.likeADoctor);
doctorRouter.post("/unlikeDoctor", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), doctorController.unlikeDoctor);
doctorRouter.post("/getMyLikes", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), doctorController.getMyLikes);
doctorRouter.get("/city/specializations", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient, Suvedha_auth_1.authenticateSuvedha), doctorController.getSpecializationByCity);
doctorRouter.post("/updateNumber", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.sendOTPToUpdateNumber);
doctorRouter.put("/verify/updateNumber", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.verifyOTPToUpdateNumber);
doctorRouter.post("/qualification", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.deleteDoctorQualification);
doctorRouter.get("/qualification/list", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.getDoctorQualificationList);
doctorRouter.put("/absence", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), doctorController.getDoctorsAllHolidayList);
doctorRouter.post("/overthecounterpayment", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.setThatDoctorTakesOverTheCounterPayments);
doctorRouter.delete("/overthecounterpayment", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.deleteThatDoctorTakesOverTheCounterPayments);
doctorRouter.get("/overthecounterpayment", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), doctorController.checkIfDoctorTakesOverTheCounterPaymentsForAHospital);
doctorRouter.post("/bookingperiod", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.setDoctorsAdvancedBookingPeriod);
doctorRouter.delete("/bookingperiod", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.deleteDoctorsAdvancedBookingPeriod);
doctorRouter.get("/bookingperiod", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), doctorController.getDoctorsAdvancedBookingPeriod);
exports.default = doctorRouter;
