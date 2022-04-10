import mongoose, { Schema, model } from "mongoose";
import {
  doctor,
  patient,
  preferredPharma,
  prescription,
} from "../Services/schemaNames";

const prescriptionSchema = new Schema({
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: doctor,
  },
  patient: {
    type: mongoose.Types.ObjectId,
    ref: patient,
  },
  pharma: {
    type: mongoose.Types.ObjectId,
    ref: preferredPharma,
  },
  prescription: {
    data: Buffer,
    contentType: String,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const prescriptionModel = model(prescription, prescriptionSchema);

export default prescriptionModel;
