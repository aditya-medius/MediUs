import mongoose, { Schema, model } from "mongoose";
import { city, locality, cityMap } from "../Services/schemaNames";
const cityMapSchema = new Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: city,
  },
  locality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: locality,
  },
});

const cityMapModel = model(cityMap, cityMapSchema);
export default cityMapModel;
