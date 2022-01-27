import express, { Request, Response } from "express";
import { authenticateDoctor } from "../authentication/Doctor.auth";
// import * as doctorController from "../Controllers/Doctor.Controller";
import * as doctorController from "../Controllers/Doctor.Controller";
import * as qualificationController from "../Controllers/Qualification.Controller";
import * as workingHoursController from "../Controllers/WorkingHours.Controller";
import { authenticatePatient } from "../authentication/Patient.auth";
import { oneOf } from "../Services/middlewareHelper";
import * as preferredPharmaController from "../Controllers/Pharma.Cotroller";
import * as kycController from "../Controllers/KYC.Controller";
import { authenticateHospital } from "../authentication/Hospital.auth";
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

doctorRouter.get("/", doctorController.getAllDoctorsList);
doctorRouter.post(
  "/getDoctorById/:id",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.getDoctorById
);
doctorRouter.get(
  "/getHospitalListByDoctorId/:id",
  oneOf(authenticateDoctor, authenticatePatient),
  doctorController.getHospitalListByDoctorId
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
doctorRouter.get(
  "/viewAppointmentsByDate/:page",
  oneOf(authenticateDoctor),
  doctorController.viewAppointmentsByDate
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
doctorRouter.post(
  "/getWorkingHours",
  oneOf(authenticateDoctor, authenticatePatient, authenticateHospital),
  workingHoursController.getWorkingHours
);

//Preferred Pharma Routes
//add the preferred pharma
doctorRouter.post(
  "/addPharma",
  authenticateDoctor,
  preferredPharmaController.addPharma
);

//get all Pharma
doctorRouter.get("/getPharma", preferredPharmaController.getPharma);

//delete the pharma using id
doctorRouter.post(
  "/delPharma/:id",
  authenticateDoctor,
  preferredPharmaController.delPharma
);

//update the pharma
doctorRouter.post(
  "/updatePharma/:id",
  authenticateDoctor,
  preferredPharmaController.updatePharma
);

// KYC details
doctorRouter.post("/setKYC", kycController.addKYC);
doctorRouter.post("/updateKyc", kycController.updateKyc);
export default doctorRouter;
