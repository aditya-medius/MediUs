import mongoose, { Schema, model } from "mongoose";
const specialitySchema = new Schema({
  specialityName: {
    type: String,
    required: true,
  },
});

const speciality = model("speciality", specialitySchema);
export default speciality;
