import mongoose, { Schema, model } from "mongoose";
import { BodyPart, speciality } from "../Services/schemaNames";

const specialityBodySchema = new Schema({
  speciality: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: speciality,
  },
  bodyParts: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: BodyPart,
  },
});

const specialityBodyModel = model(speciality, specialityBodySchema);

export default specialityBodyModel;
