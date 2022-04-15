import mongoose, { Schema, model } from "mongoose";
import { approvalRequest, doctor, hospital } from "../Services/schemaNames";

const approvalSchema = new Schema({
  /* Kisne request ki hai */
  requestFrom: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "ref_From",
  },
  ref_From: {
    type: String,
    enum: [doctor, hospital],
  },

  /* Kiske liye request ki hai */
  requestTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "ref_To",
  },
  ref_To: {
    type: String,
    enum: [doctor, hospital],
  },

  approvalStatus: {
    type: String,
    default: "Pending",
    enum: ["Approved", "Pending", "Denied"],
  },

  delData: {
    deleted: { type: Boolean, default: false },
    deletedAt: {
      type: Date,
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const approvalModel = model(approvalRequest, approvalSchema);

export default approvalModel;
