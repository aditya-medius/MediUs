import mongoose, { Schema, model } from "mongoose";
const specialitySchema = new Schema({
  speciality: {
    type: String,
    required: true,
  },
  bodyPart: [
    {
      type: String,
      required: true,
    },
  ],
  disease: {
    type: String,
    required: true,
  },
});

const speciality = model("speciality", specialitySchema);
export default speciality;
