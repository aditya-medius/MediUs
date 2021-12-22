import express, { Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
// import * as doctorController from "../Controllers/Doctor.Controller";
import * as doctorController from "../Controllers/Doctor.Controller";
import * as qualificationController from "../Controllers/Qualification.Controller";
import * as workingHoursController from "../Controllers/WorkingHours.Controller";
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

export default doctorRouter;
