import mongoose, { Schema, model } from "mongoose";
// import { specia } from "../Services/schemaNames";

const hospitalSpecialitySchema=new Schema({
    hospitalspeciality:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

const hospitalSpecialityModel=model("special", hospitalSpecialitySchema);
export default hospitalSpecialityModel;