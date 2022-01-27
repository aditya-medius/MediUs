import mongoose, { Schema, model } from "mongoose";
import { doctor, hospital, patient, feedback } from "../Services/schemaNames";

const feedbackSchema = new Schema({
  feedback: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "InModel",
    // ref: [doctor, patient, hospital],
  },
  InModel: {
    type: String,
  },
});

const feedbackModel = model(feedback, feedbackSchema);
export default feedbackModel;
