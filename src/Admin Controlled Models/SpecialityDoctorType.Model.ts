import mongoose, { Schema, model } from "mongoose";
import {
  specialityDoctorType,
  specialization,
  doctorType,
} from "../Services/schemaNames";

const specialityDoctorTypeSchema = new Schema({
  speciality: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: specialization,
  },

  doctorType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      uniqueItems: true,
      required: true,
      ref: doctorType,
    },
  ],
});

specialityDoctorTypeSchema
  .path("doctorType")
  .validate(function (doctorType: any) {
    if (doctorType.length < 1) {
      return false;
    }
    return true;
  }, "Add at least one doctor type");
const specialityDoctorTypeModel = model(
  specialityDoctorType,
  specialityDoctorTypeSchema
);

export default specialityDoctorTypeModel;
