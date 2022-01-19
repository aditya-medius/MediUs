import mongoose, { Schema, model } from "mongoose";
import { qualification } from "../Services/schemaNames";
import validator from "validator";
const qualificationSchema = new Schema({
  qualificationName: {
    type: String,
    required: [true, "Qualification name is required"],
  },
  certificationOrganisation: {
    type: String,
    required: [true, "Certification Organisation is required"],
  },
  duration: {
    type: {
      from: {
        type: Date,
        required: true,
      },
      till: {
        type: Date,
        required: true,
      },
    },
    required: [true, "Duration is required"],
  },
  email: {
    type: String,
    // required: [true, "Email is required"],
    validate: [validator.isEmail, "Email isn't valid"],
    // unique: true,
  },
});

const qualificationModel = model(qualification, qualificationSchema);

export default qualificationModel;
