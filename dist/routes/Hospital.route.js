"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Doctor_auth_1 = require("../authentication/Doctor.auth");
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const Patient_auth_1 = require("../authentication/Patient.auth");
const Approval_Request_Controller_1 = require("../Controllers/Approval-Request.Controller");
const hospitalController = __importStar(require("../Controllers/Hospital.Controller"));
const WorkingHours_Controller_1 = require("../Controllers/WorkingHours.Controller");
const middlewareHelper_1 = require("../Services/middlewareHelper");
const response_1 = require("../Services/response");
const feeService = __importStar(require("../Module/Payment/Service/Fee.Service"));
const Suvedha_auth_1 = require("../authentication/Suvedha.auth");
const Prescription_Validity_Controller_1 = require("../Controllers/Prescription-Validity.Controller");
const Admin_auth_1 = require("../authentication/Admin.auth");
const hospitalRouter = express_1.default.Router();
hospitalRouter.get("/", 
// oneOf(authenticateHospital),
hospitalController.getAllHospitalsList);
hospitalRouter.post("/login", hospitalController.login);
hospitalRouter.post("/loginWithPassword", hospitalController.loginWithPassword);
hospitalRouter.get("/myHospital", Hospital_auth_1.authenticateHospital, hospitalController.myHospital);
// hospitalRouter.get("/", authenticateHospital, hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);
hospitalRouter.post("/deleteHospital", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.deleteHospital);
hospitalRouter.post("/updateHospital", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), 
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
hospitalController.updateHospital);
hospitalRouter.post("/anemity", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.createHospitalAnemity);
hospitalRouter.get("/getAnemities", hospitalController.getAnemities);
hospitalRouter.get("/getServices", hospitalController.getServices);
// hospitalRouter.post("/speciality",oneOf(authenticateHospital),hospitalController.addHospitalSpeciality);
hospitalRouter.get("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);
//ADD DOCTOR TO THE HOSPITAL
hospitalRouter.post("/removeDoctor", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.removeDoctor);
// ADD DOCTOR TO THE HOSPITAL
hospitalRouter.post("/add/doctor", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.addDoctor);
//View Appointments
hospitalRouter.get("/viewAppointment/:page", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.viewAppointment);
// Get hospital by id
hospitalRouter.put("/getHospitalById/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Suvedha_auth_1.authenticateSuvedha, Admin_auth_1.authenticateAdmin), hospitalController.getHospitalById);
// Hospital opening hours
hospitalRouter.post("/createOpeningHours", WorkingHours_Controller_1.createOpeningHours);
// hospital me kaam krne waale doctors
hospitalRouter.get("/getDoctorsInHospital", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getDoctorsInHospital);
hospitalRouter.post("/getAppointmentByDate", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getAppointmentByDate);
hospitalRouter.put("/checkVerificationStatus", hospitalController.checkVerificationStatus);
/* Doctor se approval ki request */
hospitalRouter.put("/requestApprovalFromDoctor", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), Approval_Request_Controller_1.requestApprovalFromDoctor);
/* Doctor k approval ki request approve kro */
hospitalRouter.put("/approveDoctorRequest", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), Approval_Request_Controller_1.approveDoctorRequest);
hospitalRouter.put("/denyDoctorRequest", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), Approval_Request_Controller_1.denyDoctorRequest);
/* Hospital ko kitno ne approval k liye request ki hai */
hospitalRouter.put("/getListOfRequestedApprovals_OfHospital", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getListOfRequestedApprovals_OfHospital);
/* Hospital ne kitno se approval ki request ki hai */
hospitalRouter.put("/getListOfRequestedApprovals_ByHospital", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getListOfRequestedApprovals_ByHospital);
/* Doctors ki offline aur online appointment */
hospitalRouter.post("/getDoctorsOfflineAndOnlineAppointments", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getDoctorsOfflineAndOnlineAppointments);
/* Hospital k liye notifications */
hospitalRouter.get("/getHospitalsNotification", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getHospitalsNotification);
/* Update hospital Address */
hospitalRouter.put("/updateHospitalAddress", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.updateHospitalAddress);
hospitalRouter.put("/getHospitalsSpecilization_AccordingToDoctor", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), hospitalController.getHospitalsSpecilization_AccordingToDoctor);
hospitalRouter.put("/getDoctorsListInHospital_withApprovalStatus", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getDoctorsListInHospital_withApprovalStatus);
hospitalRouter.get("/searchHospitalByPhoneNumber/:term", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital, Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), hospitalController.searchHospitalByPhoneNumber);
hospitalRouter.get("/getFees", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital, Doctor_auth_1.authenticateDoctor), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield feeService.getAllFees();
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}));
hospitalRouter.put("/getPatientsAppointmentsInThisHospital/:page", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getPatientsAppointmentsInThisHospital);
hospitalRouter.post("/verifyPayment", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorId = req.body.doctors, patientId = req.body.patient, hospitalId = req.body.hospital, subPatientId = req.body.subPatient;
        let valid = yield (0, Prescription_Validity_Controller_1.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod)({
            doctorId,
            patientId,
            hospitalId,
            subPatientId,
        });
        if (req.currentHospital) {
            req.body.appointment["appointmentBookedBy"] = "Hospital";
        }
        next();
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}), hospitalController.verifyPayment);
hospitalRouter.post("/generateOrderId", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.generateOrderId);
hospitalRouter.put("/doctors/in/hospital", 
// oneOf(authenticateHospital),
hospitalController.doctorsInHospitalWithTimings);
hospitalRouter.get("/getHospitalDetails/:id", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getHospitalDetails);
hospitalRouter.post("/updateNumber", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.sendOTPToUpdateNumber);
hospitalRouter.put("/verify/updateNumber", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.verifyOTPToUpdateNumber);
hospitalRouter.put("/update/status", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.changeAppointmentStatus);
hospitalRouter.put("/holiday", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.addHolidayForHospital);
hospitalRouter.get("/holiday", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getHospitalsHoliday);
hospitalRouter.put("/verify/number", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.verifyHospitalPhoneNumber);
hospitalRouter.put("/resendotp", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.resendOtpToHospital);
hospitalRouter.get("/otpforpasswordchange", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getOtpForPasswordChange);
hospitalRouter.put("/otpforpasswordchange", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.verifyOtpForPasswordChange);
hospitalRouter.put("/change/password", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.changePassword);
exports.default = hospitalRouter;
