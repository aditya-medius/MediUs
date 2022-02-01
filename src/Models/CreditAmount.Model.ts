import mongoose, { Schema, model } from "mongoose";
import { appointment, creditAmount, order } from "../Services/schemaNames";
const creditAmountSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  appointmentDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: appointment,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: order,
  },
});

const creditAmountModel = model(creditAmount, creditAmountSchema);
export default creditAmountModel;
