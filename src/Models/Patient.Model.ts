import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";

const patientSchema = new Schema({
  ...schemaOptions,

});


const patient = model("patient", patientSchema);
export default patient;
