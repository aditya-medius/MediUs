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
const middlewareHelper_1 = require("../Services/middlewareHelper");
const subPatientController = __importStar(require("../Controllers/SubPatient.Controller"));
const patientRouter = express_1.default.Router();
patientRouter.post("/login", patientController.patientLogin);
patientRouter.post("/", patientController.createPatient);
patientRouter.get("/", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getAllPatientsList);
patientRouter.post("/getPatientById/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getPatientById);
patientRouter.post("/updateProfile", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.updatePatientProfile);
patientRouter.post("/deleteProfile", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.deleteProfile);
patientRouter.post("/BookAppointment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.BookAppointment);
patientRouter.post("/CancelAppointment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.CancelAppointment);
patientRouter.post("/doneAppointment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.doneAppointment);
patientRouter.post("/getDoctorByDay", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getDoctorByDay);
patientRouter.post("/generateOrderId", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), paymentController.generateOrderId);
patientRouter.post("/verifyPayment", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), paymentController.verifyPayment);
patientRouter.get("/viewAppointment/:page", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.ViewAppointment);
// Get all the entities of filter
patientRouter.get("/getSpecialityBodyPartAndDisease", patientController.getSpecialityBodyPartAndDisease);
// Get hospitals by city
patientRouter.get("/getHospitalsByCity", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getHospitalsByCity);
// Get doctors by city
patientRouter.get("/getDoctorsByCity", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), patientController.getDoctorsByCity);
// Sub Patient
patientRouter.post("/addSubPatient", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.addSubPatient);
patientRouter.get("/getSubPatientList", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.getSubPatientList);
patientRouter.put("/deleteSubPatient/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.deleteSubPatient);
patientRouter.get("/getSubPatientById/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.getSubPatientById);
patientRouter.put("/updateSubPatient/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient), subPatientController.updateSubPatient);
exports.default = patientRouter;
