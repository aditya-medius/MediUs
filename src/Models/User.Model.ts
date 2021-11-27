import mongoose, { Schema, ObjectId, model } from "mongoose";

const options = { discriminatorKey: "kind" };
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  options
);

// User Model
const userModel = model("user", userSchema);

// Child Models
const doctorModel = userModel.discriminator(
  "patient",
  new Schema({
    hospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hospital",
      },
    ],
    panCard: {
      type: String,
      required: true,
    },
    qualification: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "qualification",
      },
    ],
  })
);
