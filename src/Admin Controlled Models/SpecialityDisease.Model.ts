import mongoose, { Schema, model } from "mongoose";
import {
  disease,
  specialityDisease,
  specialization,
} from "../Services/schemaNames";

const specialityDiseaseSchema = new Schema({
  speciality: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: specialization,
  },

  disease: [
    {
      type: mongoose.Schema.Types.ObjectId,
      uniqueItems: true,
      required: true,
      ref: disease,
    },
  ],
});

specialityDiseaseSchema.path("disease").validate(function (disease: any) {
  if (disease.length < 1) {
    return false;
  }
  return true;
}, "Add at least one disease");
const specialityDiseaseModel = model(
  specialityDisease,
  specialityDiseaseSchema
);

export default specialityDiseaseModel;
