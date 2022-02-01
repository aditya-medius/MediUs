import mongoose, { Schema, model } from "mongoose";
import { order } from "../Services/schemaNames";

const orderSchema = new Schema({
  receipt: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const orderModel = model(order, orderSchema);
export default orderModel;
