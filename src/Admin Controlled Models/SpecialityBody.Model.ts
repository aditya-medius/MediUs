import mongoose, { Schema, model } from "mongoose";
import { BodyPart, speciality, specialization } from "../Services/schemaNames";

const specialityBodySchema = new Schema({
  speciality: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: specialization,
  },

  bodyParts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      uniqueItems: true,
      required: true,
      ref: BodyPart,
    },
  ],
});

const specialityBodyModel = model(speciality, specialityBodySchema);

export default specialityBodyModel;
