import mongoose, { Schema, model } from "mongoose";
import { approveStatus, hospital, doctor } from "../Services/schemaNames";

const approveStatusSchema = new Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "refFrom",
    required: true,
  },
  for: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "refFor",
    required: true,
  },
  refFrom: {
    type: String,
    enum: [hospital, doctor],
    required: true,
  },
  refFor: {
    type: String,
    enum: [doctor, hospital],
    required: true,
  },
  approvedStatus: {
    type: String,
    default: "UnApproved",
    enum: ["Unapproved", "Approved"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const approveStatusModel = model(approveStatus, approveStatusSchema);

export default approveStatusModel;
