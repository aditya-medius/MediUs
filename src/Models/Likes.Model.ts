import mongoose, { Schema, model } from "mongoose";
import { doctor, like, patient, hospital } from "../Services/schemaNames";

const likeSchema = new Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: doctor,
  },
  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "reference",
  },
  reference: {
    type: String,
    enum: [patient, hospital],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  unlike: {
    type: Boolean,
  },
});

const likeModel = model(like, likeSchema);
export default likeModel;
