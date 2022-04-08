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
const Doctor_auth_1 = require("../authentication/Doctor.auth");
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const Patient_auth_1 = require("../authentication/Patient.auth");
const Approval_Request_Controller_1 = require("../Controllers/Approval-Request.Controller");
const hospitalController = __importStar(require("../Controllers/Hospital.Controller"));
const WorkingHours_Controller_1 = require("../Controllers/WorkingHours.Controller");
const Approval_Request_Service_1 = require("../Services/Approval-Request/Approval-Request.Service");
const middlewareHelper_1 = require("../Services/middlewareHelper");
const response_1 = require("../Services/response");
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
hospitalRouter.post("/updateHospital", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { doctors } = req.body;
    if (doctors) {
        try {
            let doctorId = doctors[0], hospitalId = req.currentHospital;
            let response = yield (0, Approval_Request_Service_1.checkHospitalsApprovalStatus)(doctorId, hospitalId);
            switch (response) {
                case "Pending": {
                    return (0, response_1.successResponse)({}, "Your request is pending", res);
                }
                case "Denied": {
                    return (0, response_1.successResponse)({}, "Your request for this doctor is denied", res);
                }
                case "Approved": {
                    next();
                }
            }
        }
        catch (error) {
            return (0, response_1.errorResponse)(error, res);
        }
    }
}), hospitalController.updateHospital);
hospitalRouter.post("/anemity", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.createHospitalAnemity);
hospitalRouter.get("/getAnemities", hospitalController.getAnemities);
hospitalRouter.get("/getServices", hospitalController.getServices);
// hospitalRouter.post("/speciality",oneOf(authenticateHospital),hospitalController.addHospitalSpeciality);
hospitalRouter.post("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);
//ADD DOCTOR TO THE HOSPITAL
hospitalRouter.post("/removeDoctor", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.removeDoctor);
//View Appointments
hospitalRouter.get("/viewAppointment/:page", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.viewAppointment);
// Get hospital by id
hospitalRouter.get("/getHospitalById/:id", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital), hospitalController.getHospitalById);
// Hospital opening hours
hospitalRouter.post("/createOpeningHours", WorkingHours_Controller_1.createOpeningHours);
// hospital me kaam krne waale doctors
hospitalRouter.get("/getDoctorsInHospital", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getDoctorsInHospital);
hospitalRouter.post("/getAppointmentByDate", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), hospitalController.getAppointmentByDate);
hospitalRouter.put("/checkVerificationStatus", hospitalController.checkVerificationStatus);
/* Doctor se approval ki request */
hospitalRouter.put("/requestApprovalFromDoctor", (0, middlewareHelper_1.oneOf)(Hospital_auth_1.authenticateHospital), Approval_Request_Controller_1.requestApprovalFromDoctor);
exports.default = hospitalRouter;
