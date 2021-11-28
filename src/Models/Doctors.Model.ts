import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
const doctorSchema = new Schema({
  ...schemaOptions,
  hospitals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hospital",
    },
  ],
  specialization: [
    {
      type: Schema.Types.ObjectId,
      ref: "speciality",
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
});

const doctor = model("doctor", doctorSchema);

export default doctor;
