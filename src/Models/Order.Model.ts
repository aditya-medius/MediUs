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
  otherCharges: {
    type: Object,
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

// orderSchema.pre("save", function (next) {});

const orderModel = model(order, orderSchema);
export default orderModel;
