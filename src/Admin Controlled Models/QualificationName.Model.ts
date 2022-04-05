import mongoose, { Schema, model } from "mongoose";
import { qualificationNames } from "../Services/schemaNames";
const qualificationSchema = new Schema({
  name: {
    type: String,
    required: [true, "Qualification name is required"],
  },
  abbreviation: {
    type: String,
    required: [true, "Qualification abbreviation is required"],
  },
  del: {
    deleted: {
      type: Boolean,
      default: false,
    },
    deltedAt: {
      type: Date,
    },
  },
});

const qualificationNameModel = model(qualificationNames, qualificationSchema);

export default qualificationNameModel;
