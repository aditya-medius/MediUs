import mongoose, { Schema, model } from "mongoose";
import { withdraw } from "../Services/schemaNames";
const withdrawSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  withdrawalAmount: {
    type: Number,
    required: true,
  },
  withdrawnBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "user",
  },
  user: {
    type: String,
    required: true,
  },

  withdrawalReceipt: {
    type: String,
    required: true,
  },
});

const withdrawModel = model(withdraw, withdrawSchema);

export default withdrawModel;
