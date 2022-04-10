import mongoose, { Schema, model } from "mongoose";
import {
  doctor,
  hospital,
  prescriptionValidity,
} from "../Services/schemaNames";

const prescriptionSchema = new Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: doctor,
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: hospital,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  validateTill: {
    type: Number,
    required: true,
  },
});

const prescriptionValidityModel = model(
  prescriptionValidity,
  prescriptionSchema
);
export default prescriptionValidityModel;
