import mongoose, { Schema, model } from "mongoose";
import { subPatient } from "../Services/schemaNames";
const subPatientSchema = new Schema({
  parentPatient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", " Other"],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const subPatientModel = model(subPatient, subPatientSchema);
export default subPatientModel;
