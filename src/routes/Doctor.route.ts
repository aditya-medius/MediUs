import express, { Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
// import * as doctorController from "../Controllers/Doctor.Controller";
import * as doctorController from "../Controllers/Doctor.Controller";
import * as qualificationController from "../Controllers/Qualification.Controller";
import * as workingHoursController from "../Controllers/WorkingHours.Controller";
import * as preferredPharmaController from "../Controllers/Pharma.Cotroller";
const doctorRouter = express.Router();

doctorRouter.post("/login", doctorController.doctorLogin);

/*
  Doctor profile creation routes - START
*/
doctorRouter.put(
  "/addDoctorQualification",
  qualificationController.addDoctorQualification
);
doctorRouter.put(
  "/addDoctorWorkingHour",
  authenticateDoctor,
  workingHoursController.createWorkingHours
);
doctorRouter.post("/", doctorController.createDoctor);
/*
  Doctor profile creation routes - END
*/

doctorRouter.get("/", authenticateDoctor, doctorController.getAllDoctorsList);
doctorRouter.post(
  "/getDoctorById/:id",
  authenticateDoctor,
  doctorController.getDoctorById
);
doctorRouter.post(
  "/updateProfile",
  authenticateDoctor,
  doctorController.updateDoctorProfile
);
doctorRouter.delete(
  "/deleteProfile",
  authenticateDoctor,
  doctorController.deleteProfile
);

doctorRouter.post(
  "/findDoctorBySpecialityOrBodyPart/:term",
  doctorController.searchDoctor
);

doctorRouter.put(
  "/setSchedule",
  authenticateDoctor,
  doctorController.setSchedule
);

// Get Doctor's appointment
doctorRouter.get(
  "/viewAppointments/:page",
  authenticateDoctor,
  doctorController.viewAppointments
);

// Cancel doctor's appointments
doctorRouter.put(
  "/cancelAppointments",
  authenticateDoctor,
  doctorController.cancelAppointments
);


//Preferred Pharma Routes
//add the preferred pharma
doctorRouter.post("/addPharma",authenticateDoctor,preferredPharmaController.addPharma);

//get all Pharma
doctorRouter.get("/getPharma",preferredPharmaController.getPharma);

//delete the pharma using id
doctorRouter.post("/delPharma/:id",authenticateDoctor,preferredPharmaController.delPharma);

//update the pharma
doctorRouter.post("/updatePharma/:id",authenticateDoctor,preferredPharmaController.updatePharma);
export default doctorRouter;
