import mongoose, { Schema, model } from "mongoose";
import { appointment, order } from "../Services/schemaNames";
const orderSchema = new Schema({
  receipt: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  appointmentDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: appointment,
    // required: true,
  },
});

const orderModel = model(order, orderSchema);
export default orderModel;
