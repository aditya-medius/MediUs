import { Router } from "express";
import * as adminController from "../Admin Controlled Models/Admin.Controller";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateAdmin } from "../authentication/Admin.auth";

const adminRouter = Router();

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
adminRouter.post(
  "/payment",
  adminController.addPayment
);

// Get cities, states, locality and country
adminRouter.get(
  "/getCityStateLocalityCountry",
  adminController.getCityStateLocalityCountry
);

// Create admin profile
adminRouter.post("/create", adminController.create);

// Get admin profile
adminRouter.get("/login", adminController.login);
export default adminRouter;
