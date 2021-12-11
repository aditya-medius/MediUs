import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";

import { country } from "../Services/schemaNames";
const countrySchema=new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    }
});

const countryModel= model(country, countrySchema);
export default countryModel;