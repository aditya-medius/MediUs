import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import {
  doctor,
  hospital,
  like,
  qualification,
  speciality,
  workingHour,
} from "../Services/schemaNames";
const doctorSchema = new Schema({
  ...schemaOptions,
  hospitalDetails: [
    {
      hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: hospital,
      },
      workingHours: {
        type: mongoose.Schema.Types.ObjectId,
        ref: workingHour,
      },
      consultationFee: {
        min: {
          type: Number,
        },
        max: {
          type: Number,
        },
      },
    },
  ],
  registrationDate: {
    type: Date,
    required: true,
  },
  specialization: [
    {
      type: Schema.Types.ObjectId,
      ref: speciality,
    },
  ],
  panCard: {
    type: String,
    required: true,
  },
  adhaarCard: {
    type: String,
    required: true,
    minlength: 12,
  },
  qualification: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: qualification,
    },
  ],

  liked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: like,
  },
});

const doctorModel = model(doctor, doctorSchema);

export default doctorModel;
