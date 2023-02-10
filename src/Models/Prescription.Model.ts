import mongoose, { Schema, model } from "mongoose";
import {
  doctor,
  hospital,
  patient,
  preferredPharma,
  prescription,
} from "../Services/schemaNames";

const prescriptionSchema = new Schema({
  doctorId: {
    type: mongoose.Types.ObjectId,
    ref: doctor,
  },
  hospitalId: {
    type: mongoose.Types.ObjectId,
    ref: hospital,
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
