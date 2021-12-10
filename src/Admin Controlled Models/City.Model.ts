import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";

import { city } from "../Services/schemaNames";
const citySchema=new Schema({
    name:{
        type: String,
        required: true
    }
});

const cityModel= model(city, citySchema);
export default cityModel;