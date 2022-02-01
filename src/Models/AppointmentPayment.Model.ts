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
});

const appointmentPaymentModel = model(
  appointmentPayment,
  appointmentPaymentSchema
);

export default appointmentPaymentModel;
