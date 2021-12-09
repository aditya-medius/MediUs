import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import 
{ 
  speciality, doctor, address, payment, anemity, hospital
} 
 from "../Services/schemaNames";
const hospitalSchema = new Schema({
  address:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: address
  },
  doctors:[
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: doctor
    }
  ],
  specialisedIn:[
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: speciality
    }
  ],
  anemity:[{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: anemity
  }],
  treatmentType:[
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  ],
  type:{
    type: String,
    required: true
  },
  payment:[
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: payment
    }
  ],

  deleted:{
    type: Boolean,
    default: false
  }

});

const hospitalModel = model(hospital, hospitalSchema);

export default hospitalModel;
