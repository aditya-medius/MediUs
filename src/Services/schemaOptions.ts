import { Schema } from "mongoose";
const schemaOptions: any = {
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: true,
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Appointments: {
    type: Schema.Types.ObjectId,
    ref: "appointment",
  },
  verified: {
    type: Boolean,
    default: false,
  },
};

export default schemaOptions;
