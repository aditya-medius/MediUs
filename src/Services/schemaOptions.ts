import { Schema } from "mongoose";
import { appointment } from "./schemaNames";
const schemaOptions: any = {
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  DOB: {
    type: Date,
    required: true,
  },
  WhatsappNumber: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: [true, "Email already exist"],
  },
  password: {
    type: String,
    required: true,
  },
  appointments: {
    type: Schema.Types.ObjectId,
    ref: appointment,
  },
  active: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
};

export default schemaOptions;
