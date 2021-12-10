import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";

import { locality } from "../Services/schemaNames";
const LocalitySchema=new Schema({
    name:{
        type: String,
        required: true
    }
});

const LocalityModel= model(locality, LocalitySchema);
export default LocalityModel;