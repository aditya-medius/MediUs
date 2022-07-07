import mongoose, { Schema, model } from "mongoose";
import { qualification, qualificationNames } from "../Services/schemaNames";
import validator from "validator";
const qualificationSchema = new Schema({
  qualificationName: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Qualification name is required"],
    ref: qualificationNames,
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
    // required: [true, "Duration is required"],
  },
  email: {
    type: String,
    // required: [true, "Email is required"],
    // validate: [validator.isEmail, "Email isn't valid"],
    // unique: true,
  },
});

qualificationSchema.pre("find", function (next) {
  this.populate("qualificationName");
  next();
});
const qualificationModel = model(qualification, qualificationSchema);

export default qualificationModel;
