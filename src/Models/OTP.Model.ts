import mongoose, { Schema, model } from "mongoose";
import { OTP } from "../Services/schemaNames";

const otpSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

const otpModel = model(OTP, otpSchema);

export default otpModel;
