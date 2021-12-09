import mongoose, { Schema, model } from "mongoose";
import { doctor, like, patient } from "../Services/schemaNames";

const likeSchema = new Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: doctor,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: patient,
  },
});

const likeModel = model(like, likeSchema);
export default likeModel;
