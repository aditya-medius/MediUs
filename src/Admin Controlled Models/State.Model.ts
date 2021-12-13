import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";

import { state } from "../Services/schemaNames";
const stateSchema=new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    }
});

const stateModel= model(state, stateSchema);
export default stateModel;