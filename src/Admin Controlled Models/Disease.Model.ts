import mongoose, { Schema, model } from "mongoose";
import { disease } from "../Services/schemaNames";

const diseaseSchema = new Schema({
  disease: {
    type: String,
    required: true,
  },
});

const diseaseModel = model(disease, diseaseSchema);

export default diseaseModel;
