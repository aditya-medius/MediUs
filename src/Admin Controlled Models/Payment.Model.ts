import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import { payment } from "../Services/schemaNames";

const paymentSchema=new Schema({
    mode:{
        type: String,
        required: true
    }
});

const paymentModel=model(payment,paymentSchema);
export default paymentModel;