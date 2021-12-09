import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
// import bodyParser from "body-parser";
import "./Services/db";
import doctorRouter from "./routes/Doctor.route";
import hospitalRouter from "./routes/Hospital.route"
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/doctor", doctorRouter);
app.use("/hospital", hospitalRouter);
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
