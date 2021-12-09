import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
// import bodyParser from "body-parser";
import "./Services/db";
import doctorRouter from "./routes/Doctor.route";
import patientRouter from "./routes/Patient.route";
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
