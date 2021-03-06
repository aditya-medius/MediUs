import mongoose, { Schema, model } from "mongoose";
import {
  appointment,
  appointmentPayment,
  order,
} from "../Services/schemaNames";

const appointmentPaymentSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: order,
    required: true,
  },
  orderReceipt: {
    type: String,
  },
  paymentId: {
    type: String,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: appointment,
    required: true,
  },
  paymentSignature: {
    type: String,
  },
  Type: {
    type: String,
    enum: ["Offline", "Online"],
  },
});

const appointmentPaymentModel = model(
  appointmentPayment,
  appointmentPaymentSchema
);

export default appointmentPaymentModel;
