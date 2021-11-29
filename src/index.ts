import express, { Request, Response } from "express";
import dotenv from "dotenv";
import "./Services/db";
import doctorRouter from "./routes/Doctor.route";
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use("/doctor", doctorRouter);
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
