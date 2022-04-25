import mongoose, { Schema, model } from "mongoose";
import { fee } from "../../../Services/schemaNames";

const feeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  feeAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const feeModel = model(fee, feeSchema);

export default feeModel;
