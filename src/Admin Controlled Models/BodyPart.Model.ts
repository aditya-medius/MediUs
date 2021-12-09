import mongoose, { Schema, model } from "mongoose";
import { BodyPart } from "../Services/schemaNames";

const bodyPartSchema = new Schema({
  bodyPart: {
    type: String,
    required: true,
  },
});

const bodyPartModel = model(BodyPart, bodyPartSchema);

export default bodyPartModel;
