import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import 
{ 
  speciality, doctor, address, payment, anemity, hospital, treatmentType, openingHour
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
      required: true,
      ref: treatmentType
    }
  ],
  type:{
    type: String,
    required: true,
    enum:{
      values: ["Private","Government"],
      message: "value not supported"
    }
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
  },
  openingHour:
  {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: openingHour
  },
  contactNumber:{
      type: String,
      required: true,
  },
  numberOfBed:{
      type: Number,
      required: true,
  }

});

const hospitalModel = model(hospital, hospitalSchema);

export default hospitalModel;
