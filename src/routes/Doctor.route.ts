import express, { Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
// import * as doctorController from "../Controllers/Doctor.Controller";
import * as doctorController from "../Controllers/Doctor.Controller";
import * as qualificationController from "../Controllers/Qualification.Controller";
import * as workingHoursController from "../Controllers/WorkingHours.Controller";
import { authenticatePatient } from "../authentication/Patient.auth";
import { oneOf } from "../Services/middlewareHelper";
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
  oneOf(authenticateDoctor),
  workingHoursController.createWorkingHours
);
doctorRouter.post("/", doctorController.createDoctor);
/*
  Doctor profile creation routes - END
*/

doctorRouter.get(
  "/",
  oneOf(authenticateDoctor),
  doctorController.getAllDoctorsList
);
doctorRouter.post(
  "/getDoctorById/:id",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.getDoctorById
);
doctorRouter.post(
  "/updateProfile",
  oneOf(authenticateDoctor),
  doctorController.updateDoctorProfile
);
doctorRouter.delete(
  "/deleteProfile",
  oneOf(authenticateDoctor),
  doctorController.deleteProfile
);

doctorRouter.post(
  "/findDoctorBySpecialityOrBodyPart/:term",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.searchDoctor
);

doctorRouter.put(
  "/setSchedule",
  oneOf(authenticateDoctor),
  doctorController.setSchedule
);

// Get Doctor's appointment
doctorRouter.get(
  "/viewAppointments/:page",
  oneOf(authenticateDoctor),
  doctorController.viewAppointments
);

// Cancel doctor's appointments
doctorRouter.put(
  "/cancelAppointments",
  oneOf(authenticateDoctor),
  doctorController.cancelAppointments
);

doctorRouter.get(
  "/getDoctorWorkingInHospitals/:id",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.getDoctorWorkingInHospitals
);
export default doctorRouter;
