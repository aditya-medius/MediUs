import mongoose, { Schema, model } from "mongoose";
import { specialization } from "../Services/schemaNames";
const specialitySchema = new Schema(
  {
    specialityName: {
      type: String,
      required: true,
    },

    active: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    specialityNameh: {
      type: String
    }
  },
  { timestamps: true }
);

const specialityModel = model(specialization, specialitySchema);
export default specialityModel;
