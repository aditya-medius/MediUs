import { Router } from "express";
import * as adminController from "../Admin Controlled Models/Admin.Controller";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateAdmin } from "../authentication/Admin.auth";
import * as patientController from "../Controllers/Patient.Controller";
import { initUpload } from "../Services/Utils";
import * as qualificationController from "../Controllers/Qualification.Controller";
import * as hospitalController from "../Controllers/Hospital.Controller";
const adminRouter = Router();

const upload = initUpload("admin");

adminRouter.post("/addSpeciality", adminController.addSpeciality);

// Body part
adminRouter.post("/addBodyPart", adminController.addBodyPart);
adminRouter.post("/addSpecialityBody", adminController.addSpecialityBody);
adminRouter.post(
  "/addToSpecialityBody/:id",
  adminController.addToSpecialityBody
);

// Disease
adminRouter.post("/addDisease", adminController.addDisease);
adminRouter.post("/addSpecialityDisease", adminController.addSpecialityDisease);
adminRouter.post(
  "/addToSpecialityDisease/:id",
  adminController.addToSpecialityDisease
);

// Doctor Type
adminRouter.post("/addDoctorType", adminController.addDoctorType);
adminRouter.post(
  "/addSpecialityDoctorType",
  adminController.addSpecialityDoctorType
);
adminRouter.post(
  "/addToSpecialityDoctorType/:id",
  adminController.addToSpecialityDoctorType
);

//routes for city anemity address state country

adminRouter.post("/city", adminController.addCity);
adminRouter.post("/state", adminController.addState);
adminRouter.post("/locality", adminController.addLocality);
adminRouter.post("/country", adminController.addCountry);
adminRouter.post("/payment", adminController.addPayment);
adminRouter.get("/getPaymentOptions", adminController.getPayments);

// Get cities, states, locality and country
adminRouter.get(
  "/getCityStateLocalityCountry",
  adminController.getCityStateLocalityCountry
);

// Create admin profile
adminRouter.post("/create", adminController.create);

// Get admin profile
adminRouter.put("/login", adminController.login);

// Anemity controller
adminRouter.post("/addHospitalService", adminController.addHospitalService);
adminRouter.post(
  "/deleteHospitalService/:id",
  adminController.deleteHospitalService
);

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
adminRouter.get(
  "/getListOfSpecialityBodyPartAndDisease",
  patientController.getSpecialityBodyPartAndDisease
);

adminRouter.post("/setCountryMap", adminController.setCountryMap);
adminRouter.post("/setStateMap", adminController.setStateMap);
adminRouter.post("/setCityMap", adminController.setCityMap);

adminRouter.post("/getStateByCountry", adminController.getStateByCountry);
adminRouter.post("/getCityByState", adminController.getCityByState);
adminRouter.post("/getLocalityByCity", adminController.getLocalityByCity);

adminRouter.get("/getAllAppointments", adminController.getAllAppointments);
adminRouter.post(
  "/uploadCSV_state",
  upload.single("file"),
  adminController.uploadCSV_state
);

adminRouter.post(
  "/uploadCSV_city",
  upload.single("file"),
  adminController.uploadCSV_city
);
adminRouter.post(
  "/uploadCSV_locality",
  upload.single("file"),
  adminController.uploadCSV_locality
);

adminRouter.get(
  "/getQualificationList",
  oneOf(authenticateAdmin),
  qualificationController.getQualificationList
);
adminRouter.post(
  "/addQualificationName",
  oneOf(authenticateAdmin),
  qualificationController.addQualificationName
);
adminRouter.post(
  "/deleteQualification/:id",
  oneOf(authenticateAdmin),
  qualificationController.deleteQualification
);
/* Qualification */
adminRouter.post("/addQualification", adminController.addQualificationn);

adminRouter.post(
  "/addAnemities",
  oneOf(authenticateAdmin),
  hospitalController.createHospitalAnemity
);

adminRouter.get(
  "/getAllAnemities",
  oneOf(authenticateAdmin),
  hospitalController.getAnemities
);
adminRouter.get(
  "/deleteAnemities/:id",
  oneOf(authenticateAdmin),
  hospitalController.deleteAnemities
);

adminRouter.post(
  "/createFee",
  oneOf(authenticateAdmin),
  adminController.createFee
);

adminRouter.post(
  "/addOwnership",
  oneOf(authenticateAdmin),
  adminController.addOwnership
);
adminRouter.get(
  "/getOwnership",
  oneOf(authenticateAdmin),
  adminController.getOwnership
);

adminRouter.post(
  "/deleteOwnership/:id",
  oneOf(authenticateAdmin),
  adminController.deleteOwnership
);
adminRouter.get("/getFees", oneOf(authenticateAdmin), adminController.getFees);

adminRouter.post(
  "/editSpeciality",
  oneOf(authenticateAdmin),
  adminController.editSpeciality
);
export default adminRouter;
