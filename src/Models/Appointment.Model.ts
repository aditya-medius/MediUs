import mongoose, { Schema, model } from "mongoose";
import {
  appointment,
  doctor,
  patient,
  hospital,
} from "../Services/schemaNames";
// import schemaOptions from "../Services/schemaOptions";
const appointmentSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: patient,
  },
  doctors: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: doctor,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: hospital,
  },
  time: {
    type: {
      from: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 24,
            ],
          },
        },
        required: true,
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 24,
            ],
          },
        },
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
});

const appointmentModel = model(appointment, appointmentSchema);

export default appointmentModel;
