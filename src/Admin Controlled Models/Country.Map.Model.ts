import mongoose, { Schema, model } from "mongoose";
import { country, CountryMap, state } from "../Services/schemaNames";
const CountryMapSchema = new Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: country,
  },
  states: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: state,
    },
  ],
});

const CountryMapModel = model(CountryMap, CountryMapSchema);
export default CountryMapModel;
