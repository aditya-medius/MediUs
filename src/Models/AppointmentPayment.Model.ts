import mongoose, { Schema, model } from "mongoose";
import { appointment, appointmentPayment } from "../Services/schemaNames";

const appointmentPaymentSchema = new Schema({
  orderId: {
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
