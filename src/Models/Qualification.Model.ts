import mongoose, { Schema, model } from "mongoose";
import { qualification } from "../Services/schemaNames";

const qualificationSchema = new Schema({
  qualificationName: {
    type: String,
    required: [true, "Qualification name is required"],
  },
  certificationOrganisation: {
    type: String,
    required: true,
  },
  duration: {
    from: {
      type: Date,
      required: true,
    },
    till: {
      type: Date,
      required: true,
    },
    required: true,
  },
});

const qualificationModel = model(qualification, qualificationSchema);

export default qualificationModel;
