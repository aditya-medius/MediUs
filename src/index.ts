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
import path from "path";
import feedbackRouter from "./routes/Feedback.route";
import { oneOf, tokenNikalo } from "./Services/middlewareHelper";
import { authenticateDoctor } from "./authentication/Doctor.auth";
import { authenticateHospital } from "./authentication/Hospital.auth";
import { authenticatePatient } from "./authentication/Patient.auth";
import mongoose from "mongoose";
import * as cronJobService from "./Services/Cron-Jobs.Service";
import commonRouter from "./routes/Common.route";

// Cron Jobs
// cronJobService.cronFunctions.forEach((e: Function) => {
//   e();
// });
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/doctor", doctorRouter);
app.use("/hospital", hospitalRouter);
app.use("/admin", adminRouter);
app.use("/patient", patientRouter);
app.use("/feedback", feedbackRouter);
app.use("/common", commonRouter);
app.use("/agent", agentRouter);

app.use("/static", express.static(path.join(__dirname, "./src/uploads")));
app.use(
  "/static",
  tokenNikalo,
  oneOf(authenticateDoctor, authenticateHospital, authenticatePatient),
  express.static(path.join(__dirname, "../uploads"))
);
app.get("test", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
