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
const Patient_auth_1 = require("../authentication/Patient.auth");
const patientController = __importStar(require("../Controllers/Patient.Controller"));
const paymentController = __importStar(require("../Controllers/AppointmentPayment.Controller"));
const multer_1 = __importDefault(require("multer"));
const middlewareHelper_1 = require("../Services/middlewareHelper");
const Doctor_auth_1 = require("../authentication/Doctor.auth");
const subPatientController = __importStar(require("../Controllers/SubPatient.Controller"));
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const response_1 = require("../Services/response");
const feeService = __importStar(require("../Module/Payment/Service/Fee.Service"));
const patientRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "./src/uploads" });
patientRouter.post("/login", patientController.patientLogin);
patientRouter.post("/", patientController.createPatient);
patientRouter.get("/", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getAllPatientsList);
patientRouter.post("/getPatientById/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getPatientById);
patientRouter.post("/updateProfile", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.updatePatientProfile);
patientRouter.post("/deleteProfile", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.deleteProfile);
const prescriptionValidtiyService = __importStar(require("../Controllers/Prescription-Validity.Controller"));
patientRouter.post("/BookAppointment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorId = req.body.doctors, patientId = req.body.patient, hospitalId = req.body.hospital, subPatientId = req.body.subPatient;
        let valid = yield prescriptionValidtiyService.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod({ doctorId, patientId, hospitalId, subPatientId });
        req.body["appointmentType"] = valid ? "Follow up" : "Fresh";
        next();
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}), patientController.BookAppointment);
patientRouter.post("/rescheduleAppointment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.rescheduleAppointment);
patientRouter.post("/CancelAppointment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital), patientController.CancelAppointment);
patientRouter.post("/doneAppointment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.doneAppointment);
patientRouter.put("/viewAppointById/:id", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), patientController.viewAppointById);
patientRouter.post("/getDoctorByDay", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getDoctorByDay);
patientRouter.post("/generateOrderId", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital), paymentController.generateOrderId);
patientRouter.post("/verifyPayment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), paymentController.verifyPayment);
patientRouter.get("/viewAppointment/:page", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.ViewAppointment);
// Get all the entities of filter
patientRouter.get("/getSpecialityBodyPartAndDisease", patientController.getSpecialityBodyPartAndDisease);
// Get hospitals by city
patientRouter.post("/getHospitalsByCity", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getHospitalsByCity);
// Get doctors by city
patientRouter.post("/getDoctorsByCity", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getDoctorsByCity);
//upload prescription
patientRouter.post("/uploadPrescription", upload.single("prescription"), Patient_auth_1.authenticatePatient, patientController.uploadPrescription);
// Sub Patient
patientRouter.post("/addSubPatient", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.addSubPatient);
patientRouter.get("/getSubPatientList", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.getSubPatientList);
patientRouter.put("/deleteSubPatient/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.deleteSubPatient);
patientRouter.get("/getSubPatientById/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.getSubPatientById);
patientRouter.put("/updateSubPatient/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.updateSubPatient);
// Check kro k doctor available hai uss din
patientRouter.post("/checkDoctorAvailability", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), patientController.checkDoctorAvailability);
// Search patient
patientRouter.get("/searchPatientByPhoneNumberOrEmail/:term", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital), patientController.searchPatientByPhoneNumberOrEmail);
patientRouter.put("/checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod);
patientRouter.get("/getPatientsNotification", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getPatientsNotification);
patientRouter.get("/getFees", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield feeService.getAllFees();
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}));
patientRouter.post("/checkIfDoctorIsOnHoliday", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital, Doctor_auth_1.authenticateDoctor), patientController.checkIfDoctorIsOnHoliday);
exports.default = patientRouter;
