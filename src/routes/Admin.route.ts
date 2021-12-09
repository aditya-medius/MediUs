import { Router } from "express";
import * as adminController from "../Controllers/Admin.Controller";
const adminRouter = Router();

adminRouter.post("/addSpeciality", adminController.addSpeciality);
adminRouter.post("/addBodyPart", adminController.addBodyPart);
adminRouter.post("/addSpecialityBody", adminController.addSpecialityBody);
adminRouter.post("/addToSpecialityBody/:id", adminController.addToSpecialityBody);
export default adminRouter;
