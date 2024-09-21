import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";

// import bodyParser from "body-parser";
import "./Services/db";
import doctorRouter from "./routes/Doctor.route";
import hospitalRouter from "./routes/Hospital.route";
import adminRouter from "./routes/Admin.route";
import patientRouter from "./routes/Patient.route";
import agentRouter from "./routes/Agent.route";
import commonRouter from "./routes/Common.route";
import path from "path";
import feedbackRouter from "./routes/Feedback.route";
import { oneOf, tokenNikalo } from "./Services/middlewareHelper";
import { authenticateDoctor } from "./authentication/Doctor.auth";
import { authenticateHospital } from "./authentication/Hospital.auth";
import { authenticatePatient } from "./authentication/Patient.auth";
import { authenticateSuvedha } from "./authentication/Suvedha.auth";
import mongoose from "mongoose";
import * as cronJobService from "./Services/Cron-Jobs.Service";
import { authenticateAdmin } from "./authentication/Admin.auth";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDoc from "../swagger.json";
import suvedhaRouter from "./routes/Suvedha.route";
import { setSpecializationActiveStatus } from "./Services/Doctor/Doctor.Service";
import appointmentScheduleRouter from "./routes/AppointmentSchedule.route";
import appointmentBookingRouter from "./routes/Appointment.Booking.route";
// Cron Jobs
cronJobService.cronFunctions.forEach((e: Function) => {
  e();
});
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/apiDocs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/doctor", doctorRouter);
app.use("/hospital", hospitalRouter);
app.use("/admin", adminRouter);
app.use("/appointment/schedule", appointmentScheduleRouter)
app.use("/appointment/book", appointmentBookingRouter)
app.use("/patient", patientRouter);
app.use("/feedback", feedbackRouter);
app.use("/common", commonRouter);
app.use("/agent", agentRouter);
app.use("/suvedha", suvedhaRouter);
app.use("/static", express.static(path.join(__dirname, "./src/uploads")));
app.use(
  "/static",
  tokenNikalo,
  oneOf(
    authenticateDoctor,
    authenticateHospital,
    authenticatePatient,
    authenticateAdmin,
    authenticateSuvedha
  ),
  express.static(path.join(__dirname, "../uploads"))
);
app.get("test", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(3000, () => {
  console.log(`Running on port ${port}`);
});

setSpecializationActiveStatus();
