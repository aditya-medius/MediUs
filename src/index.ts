import express, { Request, Response } from "express";
import dotenv from "dotenv";
import "./Services/db";
dotenv.config();

const port = process.env.PORT;
const app = express();


app.listen(port, () => {
  console.log(`Running on port ${port}`);
});