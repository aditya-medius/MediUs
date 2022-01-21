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
<<<<<<< HEAD
=======
const Patient_auth_1 = require("../authentication/Patient.auth");
const middlewareHelper_1 = require("../Services/middlewareHelper");
>>>>>>> 113b476190ab7e51a4c8ac2932498ea61e66b77d
const preferredPharmaController = __importStar(require("../Controllers/Pharma.Cotroller"));
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
doctorRouter.post("/getDoctorById/:id", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), doctorController.getDoctorById);
doctorRouter.post("/updateProfile", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.updateDoctorProfile);
doctorRouter.delete("/deleteProfile", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.deleteProfile);
doctorRouter.post("/findDoctorBySpecialityOrBodyPart/:term", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), doctorController.searchDoctor);
doctorRouter.put("/setSchedule", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.setSchedule);
// Get Doctor's appointment
doctorRouter.get("/viewAppointments/:page", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.viewAppointments);
// Cancel doctor's appointments
<<<<<<< HEAD
doctorRouter.put("/cancelAppointments", Doctor_auth_1.authenticateDoctor, doctorController.cancelAppointments);
=======
doctorRouter.put("/cancelAppointments", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor), doctorController.cancelAppointments);
doctorRouter.get("/getDoctorWorkingInHospitals/:id", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Patient_auth_1.authenticatePatient), doctorController.getDoctorWorkingInHospitals);
>>>>>>> 113b476190ab7e51a4c8ac2932498ea61e66b77d
//Preferred Pharma Routes
//add the preferred pharma
doctorRouter.post("/addPharma", Doctor_auth_1.authenticateDoctor, preferredPharmaController.addPharma);
//get all Pharma
doctorRouter.get("/getPharma", preferredPharmaController.getPharma);
//delete the pharma using id
doctorRouter.post("/delPharma/:id", Doctor_auth_1.authenticateDoctor, preferredPharmaController.delPharma);
//update the pharma
doctorRouter.post("/updatePharma/:id", Doctor_auth_1.authenticateDoctor, preferredPharmaController.updatePharma);
exports.default = doctorRouter;
