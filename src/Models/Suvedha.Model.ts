import mongoose, { Schema, model } from "mongoose";
import { address, suvedha } from "../Services/schemaNames";
import schemaOptions from "../Services/schemaOptions";

const suvedhaSchema = new Schema({
  ...schemaOptions,
  password: {
    type: String,
  },
  adhaarCard: {
    type: String,
    length: 12,
  },
  alternateNumber: {
    type: String,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: address,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    // longitude first then latitude
    coordinates: {
      type: [Number],
    },
  },
  paymentDetails: {
    accountHolderName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    IFSCNumber: {
      type: String,
    },
    panNumber: {
      type: String,
    },
  },

  documents: {
    adhaar: {
      type: String,
    },
    panCard: {
      type: String,
    },
  },
});

suvedhaSchema.index({ coordinates: "2dsphere" });

const suvedhaModel = model(suvedha, suvedhaSchema);

export default suvedhaModel;
