import mongoose, { Schema, model } from "mongoose";
import { speciality } from "../Services/schemaNames";
const specialitySchema = new Schema({
  speciality: {
    type: String,
    required: true,
  },
  bodyPart: [
    {
      type: String,
      required: true,
    },
  ],
  disease: {
    type: String,
    required: true,
  },
});

const specialityModel = model(speciality, specialitySchema);
export default specialityModel;
