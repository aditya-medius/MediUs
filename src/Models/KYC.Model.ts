import mongoose, { Schema, model } from "mongoose";
import _ from "lodash";
import { kycDetails } from "../Services/schemaNames";
const kycSchema = new Schema(
  {
    panCard: {
      type: String,
      required: true,
      unique: true,
    },
    bankName: {
      type: String,
    },
    bankAccountNumber: {
      type: String,
      unique: true,
    },
    IFSC: {
      type: String,
    },
    adhaarCard: {
      type: String,
      // required: true,
      // minlength: 12,
      // unique: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const kycModel = model(kycDetails, kycSchema);

export default kycModel;
