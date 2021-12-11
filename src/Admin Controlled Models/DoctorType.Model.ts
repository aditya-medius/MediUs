import mongoose, { Schema, model } from "mongoose";
import { doctorType } from "../Services/schemaNames";

const doctorTypeSchema = new Schema({
  doctorType: {
    type: String,
    required: true,
  },
});

const doctorTypeModel = model(doctorType, doctorTypeSchema);

export default doctorTypeModel;
