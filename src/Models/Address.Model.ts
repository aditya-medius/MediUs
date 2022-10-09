import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import {
  address,
  city,
  state,
  locality,
  country,
} from "../Services/schemaNames";

const addressSchema = new Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: city,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: state,
  },
  locality: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: locality,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: country,
  },
  pincode: {
    type: String,
    required: true,
  },
  addressLine_1: {
    type: String,
    // required: true,
  },
  addressLine_2: {
    type: String,
    // required: true
  },
});
const addressModel = model(address, addressSchema);

export default addressModel;
