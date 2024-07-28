import mongoose, { Schema, model } from "mongoose";
import { overTheCounterPayment } from "../Services/schemaNames";
import { UserType } from "../Services/Helpers";
const overTheCounterPaymentSchema = new Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdBy: {
        type: String,
        enum: [UserType.HOSPITAL, UserType.DOCTOR]
    }, 
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const overTheCounterModel = model(overTheCounterPayment, overTheCounterPaymentSchema);

export default overTheCounterModel;
