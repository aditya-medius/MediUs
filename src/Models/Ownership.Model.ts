import mongoose, { Schema, model } from "mongoose";
import { ownership } from "../Services/schemaNames";

const ownershipSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ownershipModel = model(ownership, ownershipSchema);

export default ownershipModel;
