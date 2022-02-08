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
import * as mediaController from "../Controllers/Media.Controller";
import multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/user");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

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
doctorRouter.get(
  "/searchDoctorByPhoneNumberOrEmail/:term",
  oneOf(authenticateDoctor, authenticatePatient, authenticateHospital),
  doctorController.searchDoctorByPhoneNumberOrEmail
);

doctorRouter.put(
  "/setSchedule",
  oneOf(authenticateDoctor),
  // doctorController.setSchedule
  workingHoursController.createWorkingHours
);

// Get Doctor's appointment
doctorRouter.get(
  "/viewAppointments/:page",
  oneOf(authenticateDoctor),
  doctorController.viewAppointments
);
doctorRouter.post(
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

// Media
doctorRouter.post(
  "/uploadImage",
  oneOf(authenticateDoctor),
  upload.single("profileImage"),
  mediaController.uploadImage
);

// Doctors ki kamayi
doctorRouter.get(
  "/getTotalEarnings",
  oneOf(authenticateDoctor),
  doctorController.getTotalEarnings
);

// Account se paise nikalna
doctorRouter.post(
  "/withdraw",
  oneOf(authenticateDoctor),
  doctorController.withdraw
);

// Balance check kro account me
doctorRouter.get(
  "/getPendingAmount",
  oneOf(authenticateDoctor),
  doctorController.getPendingAmount
);

// kitni appointment bachi hai, poori ho gayi hai aur cancel ho gayi hai. Uska data
doctorRouter.get(
  "/appointmentSummary",
  oneOf(authenticateDoctor),
  doctorController.getAppointmentSummary
);
export default doctorRouter;
