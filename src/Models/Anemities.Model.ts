import mongoose, { Schema, model } from "mongoose";

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

const anemity = model("anemity", anemitySchema);
export default anemity;
