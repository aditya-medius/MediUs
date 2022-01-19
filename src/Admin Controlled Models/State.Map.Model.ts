import mongoose, { Schema, model } from "mongoose";
import { city, state, stateMap } from "../Services/schemaNames";
const stateMapSchema = new Schema({
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: state,
  },
  cities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: city,
    },
  ],
});

const StateMapModel = model(stateMap, stateMapSchema);
export default StateMapModel;
