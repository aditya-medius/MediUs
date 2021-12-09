import mongoose, { Schema, model } from "mongoose";
import { patient } from "../Services/schemaNames";
import schemaOptions from "../Services/schemaOptions";

const patientSchema = new Schema({
  ...schemaOptions,
});

const patientModel = model(patient, patientSchema);
export default patientModel;
