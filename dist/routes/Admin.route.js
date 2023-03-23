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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = __importStar(require("../Admin Controlled Models/Admin.Controller"));
const middlewareHelper_1 = require("../Services/middlewareHelper");
const Admin_auth_1 = require("../authentication/Admin.auth");
const patientController = __importStar(require("../Controllers/Patient.Controller"));
const Utils_1 = require("../Services/Utils");
const qualificationController = __importStar(require("../Controllers/Qualification.Controller"));
const hospitalController = __importStar(require("../Controllers/Hospital.Controller"));
const adminRouter = (0, express_1.Router)();
const upload = (0, Utils_1.initUpload)("admin");
adminRouter.post("/addSpeciality", adminController.addSpeciality);
// Body part
adminRouter.post("/addBodyPart", adminController.addBodyPart);
adminRouter.post("/addSpecialityBody", adminController.addSpecialityBody);
adminRouter.post("/addToSpecialityBody/:id", adminController.addToSpecialityBody);
// Disease
adminRouter.post("/addDisease", adminController.addDisease);
adminRouter.post("/addSpecialityDisease", adminController.addSpecialityDisease);
adminRouter.post("/addToSpecialityDisease/:id", adminController.addToSpecialityDisease);
// Doctor Type
adminRouter.post("/addDoctorType", adminController.addDoctorType);
adminRouter.post("/addSpecialityDoctorType", adminController.addSpecialityDoctorType);
adminRouter.post("/addToSpecialityDoctorType/:id", adminController.addToSpecialityDoctorType);
//routes for city anemity address state country
adminRouter.post("/city", adminController.addCity);
adminRouter.post("/state", adminController.addState);
adminRouter.post("/locality", adminController.addLocality);
adminRouter.post("/country", adminController.addCountry);
adminRouter.post("/payment", adminController.addPayment);
adminRouter.get("/getPaymentOptions", adminController.getPayments);
// Get cities, states, locality and country
adminRouter.get("/getCityStateLocalityCountry", adminController.getCityStateLocalityCountry);
// Create admin profile
adminRouter.post("/create", adminController.create);
// Get admin profile
adminRouter.put("/login", adminController.login);
// Anemity controller
adminRouter.post("/addHospitalService", adminController.addHospitalService);
adminRouter.post("/deleteHospitalService/:id", adminController.deleteHospitalService);
// Verification doctors ka
adminRouter.get("/getUnverifiedDoctors", adminController.getUnverifiedDoctors);
adminRouter.put("/verifyDoctors/:doctorId", adminController.verifyDoctors);
adminRouter.put("/verifyHospital/:hospitalId", adminController.verifyHospitals);
adminRouter.put("/verifyAgent/:agentId", adminController.verifyAgents);
adminRouter.get("/getAllDoctorsList", adminController.getAllDoctorsList);
adminRouter.get("/getAllHospitalList", adminController.getAllHospitalList);
adminRouter.get("/getAllAgentList", adminController.getAllAgentList);
adminRouter.get("/getAllSuvedhaList", adminController.getAllSuvedhaList);
adminRouter.get("/getAllPatientList", adminController.getAllPatientList);
adminRouter.get("/getListOfSpecialityBodyPartAndDisease", patientController.getSpecialityBodyPartAndDisease);
adminRouter.post("/setCountryMap", adminController.setCountryMap);
adminRouter.post("/setStateMap", adminController.setStateMap);
adminRouter.post("/setCityMap", adminController.setCityMap);
adminRouter.post("/getStateByCountry", adminController.getStateByCountry);
adminRouter.post("/getCityByState", adminController.getCityByState);
adminRouter.post("/getLocalityByCity", adminController.getLocalityByCity);
adminRouter.get("/getAllAppointments", adminController.getAllAppointments);
adminRouter.post("/uploadCSV_state", upload.single("file"), adminController.uploadCSV_state);
adminRouter.post("/uploadCSV_city", upload.single("file"), adminController.uploadCSV_city);
adminRouter.post("/uploadCSV_locality", upload.single("file"), adminController.uploadCSV_locality);
adminRouter.get("/getQualificationList", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), qualificationController.getQualificationList);
adminRouter.post("/addQualificationName", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), qualificationController.addQualificationName);
adminRouter.post("/deleteQualification/:id", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), qualificationController.deleteQualification);
/* Qualification */
adminRouter.post("/addQualification", adminController.addQualificationn);
adminRouter.post("/addAnemities", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), hospitalController.createHospitalAnemity);
adminRouter.get("/getAllAnemities", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), hospitalController.getAnemities);
adminRouter.get("/deleteAnemities/:id", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), hospitalController.deleteAnemities);
adminRouter.post("/createFee", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), adminController.createFee);
adminRouter.post("/addOwnership", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), adminController.addOwnership);
adminRouter.get("/getOwnership", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), adminController.getOwnership);
adminRouter.post("/deleteOwnership/:id", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), adminController.deleteOwnership);
adminRouter.get("/getFees", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), adminController.getFees);
adminRouter.post("/editSpeciality", (0, middlewareHelper_1.oneOf)(Admin_auth_1.authenticateAdmin), adminController.editSpeciality);
exports.default = adminRouter;
