import mongoose, { Schema, model } from "mongoose";

const likesSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "doctor",
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "patient",
  },
});

const likes = model("likes", likesSchema);

export default likes;
