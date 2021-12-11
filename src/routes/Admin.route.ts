import { Router } from "express";
import * as adminController from "../Admin Controlled Models/Admin.Controller";
const adminRouter = Router();

adminRouter.post("/addSpeciality", adminController.addSpeciality);
adminRouter.post("/addBodyPart", adminController.addBodyPart);
adminRouter.post("/addSpecialityBody", adminController.addSpecialityBody);
adminRouter.post("/addToSpecialityBody/:id", adminController.addToSpecialityBody);


//routes for city anemity address state country

adminRouter.post("/city",adminController.addCity);
adminRouter.post("/state",adminController.addState);
adminRouter.post("/locality",adminController.addLocality);
adminRouter.post("/country",adminController.addCountry);
adminRouter.post("/payment",adminController.addPayment);
export default adminRouter;
