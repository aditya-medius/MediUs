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
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
const Suvedha_auth_1 = require("../authentication/Suvedha.auth");
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const Utils_1 = require("../Services/Utils");
const moment_1 = __importDefault(require("moment"));
const SubPatient_Model_1 = __importDefault(require("../Models/SubPatient.Model"));
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
patientRouter.post("/generateOrderId", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital, Suvedha_auth_1.authenticateSuvedha), paymentController.generateOrderId);
patientRouter.post("/verifyPayment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Suvedha_auth_1.authenticateSuvedha), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorId = req.body.appointment.doctors, patientId = req.body.appointment.patient, hospitalId = req.body.appointment.hospital, subPatientId = req.body.appointment.subPatient;
        let valid = yield prescriptionValidtiyService.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod({ doctorId, patientId, hospitalId, subPatientId });
        req.body["appointmentType"] = valid ? "Follow up" : "Fresh";
        if (req.currentPatient) {
            req.body.appointment["appointmentBookedBy"] = "Patient";
        }
        else if (req.currentSuvedha) {
            req.body.appointment["appointmentBookedBy"] = "Suvedha";
        }
        next();
        const body = "You have a new appoitment";
        const title = "New appointment";
        const notification = { body, title };
        const doctorData = Doctors_Model_1.default.findOne({ _id: doctorId });
        const hospitalData = Hospital_Model_1.default.findOne({ _id: hospitalId });
        const patientData = Patient_Model_1.default.findOne({ _id: patientId });
        let arr = [doctorData, hospitalData, patientData];
        let subpatientData;
        if (subPatientId) {
            subpatientData = SubPatient_Model_1.default.findOne({ _id: subPatientId });
        }
        subPatientId && arr.push(subpatientData);
        Promise.all(arr).then((result) => {
            const [D, H, P, SP] = result;
            const doctorFirebaseToken = D.firebaseToken, hospitalFirebaseToken = H.firebaseToken, patientFirebaseToken = P.firebaseToken;
            (0, Utils_1.sendNotificationToDoctor)(doctorFirebaseToken, {
                title: "New appointment",
                body: `${P.firstName} ${P.lastName} has booked an appointment at ${H.name} and ${(0, moment_1.default)(req.body.appointment.time.date).format("DD-MM-YYYY")} ${req.body.appointment.time.from.time}:${req.body.appointment.time.from.division} -${req.body.appointment.time.till.time}:${req.body.appointment.time.till.division} `,
            });
            (0, Utils_1.sendNotificationToHospital)(hospitalFirebaseToken, {
                title: "New appointment",
                body: `${P.firstName} ${P.lastName} has booked an appointment with ${D.firstName} ${D.lastName} and ${(0, moment_1.default)(req.body.appointment.time.date).format("DD-MM-YYYY")} ${req.body.appointment.time.from.time}:${req.body.appointment.time.from.division} -${req.body.appointment.time.till.time}:${req.body.appointment.time.till.division} `,
            });
            (0, Utils_1.sendNotificationToPatient)(patientFirebaseToken, {
                title: "New appointment",
                body: `${P.firstName} ${P.lastName} has booked an appointment for ${D.firstName} ${D.lastName} at ${H.name} and ${(0, moment_1.default)(req.body.appointment.time.date).format("DD-MM-YYYY")} ${req.body.appointment.time.from.time}:${req.body.appointment.time.from.division} -${req.body.appointment.time.till.time}:${req.body.appointment.time.till.division} `,
            });
            let name = `${P.firstName} ${P.lastName}`;
            if (SP) {
                name = `${SP.firstName} ${SP.lastName}`;
            }
            Utils_1.digiMilesSMS.sendAppointmentConfirmationNotification(P.phoneNumber, name, `${D.firstName} ${D.lastName}`, H.name, (0, moment_1.default)(req.body.appointment.time.date).format("DD-MM-YYYY"), `${req.body.appointment.time.from.time}:${req.body.appointment.time.from.division} -${req.body.appointment.time.till.time}:${req.body.appointment.time.till.division}`);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}), paymentController.verifyPayment);
patientRouter.get("/viewAppointment/:page", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.ViewAppointment);
// Get all the entities of filter
patientRouter.get("/getSpecialityBodyPartAndDisease", patientController.getSpecialityBodyPartAndDisease);
// Get hospitals by city
patientRouter.post("/getHospitalsByCity", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getHospitalsByCity);
// Get doctors by city
patientRouter.post("/getDoctorsByCity", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Suvedha_auth_1.authenticateSuvedha), patientController.getDoctorsByCity);
//upload prescription
patientRouter.post("/uploadPrescription", upload.single("prescription"), Patient_auth_1.authenticatePatient, patientController.uploadPrescription);
// Sub Patient
patientRouter.post("/addSubPatient", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.addSubPatient);
patientRouter.get("/getSubPatientList", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.getSubPatientList);
patientRouter.put("/deleteSubPatient/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.deleteSubPatient);
patientRouter.get("/getSubPatientById/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.getSubPatientById);
patientRouter.put("/updateSubPatient/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.updateSubPatient);
// Check kro k doctor available hai uss din
patientRouter.post("/checkDoctorAvailability", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient, Suvedha_auth_1.authenticateSuvedha), patientController.checkDoctorAvailability);
// Search patient
patientRouter.get("/searchPatientByPhoneNumberOrEmail/:term", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital, Suvedha_auth_1.authenticateSuvedha), patientController.searchPatientByPhoneNumberOrEmail);
patientRouter.put("/checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod);
patientRouter.get("/getPatientsNotification", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getPatientsNotification);
patientRouter.get("/getFees", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield feeService.getAllFees({ name: "Convenience Fee" });
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}));
patientRouter.post("/checkIfDoctorIsOnHoliday", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital, Doctor_auth_1.authenticateDoctor), patientController.checkIfDoctorIsOnHoliday);
patientRouter.post("/canDoctorTakeAppointment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital), patientController.canDoctorTakeAppointment);
patientRouter.get("/getMyLikes/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getDoctorsIHaveLikes);
exports.default = patientRouter;
