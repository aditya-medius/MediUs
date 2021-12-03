import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
const hospitalSchema = new Schema({
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

const hospital = model("hospital", hospitalSchema);

export default hospital;
