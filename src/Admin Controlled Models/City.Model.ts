import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";

import { city } from "../Services/schemaNames";
const citySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  "city-id": {
    type: String,
  },
  city_state: {
    type: String,
  },
  url: {
    type: String,
  },
});

const cityModel = model(city, citySchema);
export default cityModel;
