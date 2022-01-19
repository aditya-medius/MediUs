import mongoose, { Schema, model } from "mongoose";
import { type } from "os";
import schemaOptions from "../Services/schemaOptions";
import { admin } from "../Services/schemaNames";

const adminSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.pre("save", async function (next) {
  const profileExist = await adminModel.findOne({
    phoneNumber: this.phoneNumber,
  });
  if (/^[0]?[789]\d{9}$/.test(this.phoneNumber)) {
    if (!profileExist) {
      return next();
    } else {
      throw new Error(
        "Profile alredy exist. Select a different phone number and email"
      );
    }
  } else {
    throw new Error("Invalid phone number");
  }
});
const adminModel = model(admin, adminSchema);

export default adminModel;
