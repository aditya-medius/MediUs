import mongoose, { Schema, model } from "mongoose";
import { advancedBookingPeriod } from "../Services/schemaNames";
import { UserType } from "../Services/Helpers";
const advancedBookingPeriodSchema = new Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId
    },
    bookingPeriod: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const advancedBookingPeriodModel = model(advancedBookingPeriod, advancedBookingPeriodSchema);

export default advancedBookingPeriodModel;
