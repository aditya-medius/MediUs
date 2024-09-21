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
const middlewareHelper_1 = require("../Services/middlewareHelper");
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const hospitalController = __importStar(require("../Controllers/Hospital.Controller"));
const Doctor_auth_1 = require("../authentication/Doctor.auth");
const Patient_auth_1 = require("../authentication/Patient.auth");
const Suvedha_auth_1 = require("../authentication/Suvedha.auth");
const Admin_auth_1 = require("../authentication/Admin.auth");
const appointmentScheduleRouter = express_1.default.Router();
appointmentScheduleRouter.get("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);
appointmentScheduleRouter.put("/doctors/in/hospital", hospitalController.doctorsInHospitalWithTimings);
appointmentScheduleRouter.get("/getHospitalDetails/:id", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getHospitalDetails);
appointmentScheduleRouter.put("/getPatientsAppointmentsInThisHospital/:page", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getPatientsAppointmentsInThisHospital);
appointmentScheduleRouter.get("/searchHospitalByPhoneNumber/:term", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital, Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), hospitalController.searchHospitalByPhoneNumber);
appointmentScheduleRouter.post("/getDoctorsOfflineAndOnlineAppointments", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getDoctorsOfflineAndOnlineAppointments);
appointmentScheduleRouter.post("/getAppointmentByDate", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getAppointmentByDate);
appointmentScheduleRouter.get("/getDoctorsInHospital", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getDoctorsInHospital);
appointmentScheduleRouter.put("/getHospitalById/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Suvedha_auth_1.authenticateSuvedha, Admin_auth_1.authenticateAdmin), hospitalController.getHospitalById);
appointmentScheduleRouter.get("/viewAppointment/:page", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.viewAppointment);
appointmentScheduleRouter.get("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);
exports.default = appointmentScheduleRouter;
