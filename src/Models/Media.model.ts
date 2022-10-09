import mongoose, { Schema, model } from "mongoose";
import {
  agent,
  doctor,
  hospital,
  media,
  patient,
  specialization,
  suvedha,
} from "../Services/schemaNames";
const mediaSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",
  },
  userType: {
    type: String,
    required: true,
    enum: [patient, doctor, hospital, agent, specialization, suvedha],
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const mediaModel = model(media, mediaSchema);
export default mediaModel;
