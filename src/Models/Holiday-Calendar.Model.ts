import { doctor, holidayCalendar } from "../Services/schemaNames";
import mongoose, { Schema, model } from "mongoose";
const holidaySchema = new Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: doctor,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  delData: {
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
});

const holidayModel = model(holidayCalendar, holidaySchema);
export default holidayModel;
