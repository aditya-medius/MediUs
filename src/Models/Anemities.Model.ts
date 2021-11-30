import mongoose, { Schema, model } from "mongoose";
import { anemity } from "../Services/schemaNames";
const anemitySchema = new Schema({
  name: {
    type: String,
  },
  anemityType: {
    type: String,
    enum: {
      values: ["Primary", "Secondary"],
      message: "value not supported",
    },
  },
});

const anemityModel = model(anemity, anemitySchema);
export default anemityModel;
