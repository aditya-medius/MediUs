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
const Patient_auth_1 = require("../authentication/Patient.auth");
const patientController = __importStar(require("../Controllers/Patient.Controller"));
const paymentController = __importStar(require("../Controllers/AppointmentPayment.Controller"));
const patientRouter = express_1.default.Router();
patientRouter.post("/login", patientController.patientLogin);
patientRouter.post("/", patientController.createPatient);
patientRouter.get("/", Patient_auth_1.authenticatePatient, patientController.getAllPatientsList);
patientRouter.post("/getPatientById/:id", Patient_auth_1.authenticatePatient, patientController.getPatientById);
patientRouter.post("/updateProfile", Patient_auth_1.authenticatePatient, patientController.updatePatientProfile);
patientRouter.post("/deleteProfile", Patient_auth_1.authenticatePatient, patientController.deleteProfile);
patientRouter.post("/BookAppointment", Patient_auth_1.authenticatePatient, patientController.BookAppointment);
patientRouter.post("/CancelAppointment", Patient_auth_1.authenticatePatient, patientController.CancelAppointment);
patientRouter.post("/doneAppointment", Patient_auth_1.authenticatePatient, patientController.doneAppointment);
patientRouter.post("/getDoctorByDay", Patient_auth_1.authenticatePatient, patientController.getDoctorByDay);
patientRouter.post("/generateOrderId", Patient_auth_1.authenticatePatient, paymentController.generateOrderId);
patientRouter.post("/verifyPayment", Patient_auth_1.authenticatePatient, paymentController.verifyPayment);
patientRouter.get("/viewAppointment/:page", Patient_auth_1.authenticatePatient, patientController.ViewAppointment);
// Get all the entities of filter
patientRouter.get("/getSpecialityBodyPartAndDisease", Patient_auth_1.authenticatePatient, patientController.getSpecialityBodyPartAndDisease);
// Get hospitals by city
patientRouter.get("/getHospitalsByCity", Patient_auth_1.authenticatePatient, patientController.getHospitalsByCity);
// Get doctors by city
patientRouter.get("/getDoctorsByCity", Patient_auth_1.authenticatePatient, patientController.getDoctorsByCity);
//upload prescription
patientRouter.post("/uploadPrescription", Patient_auth_1.authenticatePatient, patientController.uploadPrescription);
exports.default = patientRouter;
