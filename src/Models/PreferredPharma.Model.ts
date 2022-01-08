import mongoose, { Schema, model } from "mongoose";
import { address, doctor, preferredPharma } from "../Services/schemaNames";

const preferredPharmaSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: address
    },
    contact:{
        type: Number,
        required: true
    },
    doctor:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: doctor
    },
    deleted:{
        type: Boolean,
        default: false
    }
});

preferredPharmaSchema.pre("save",async function(next){
    const pharmaExist= await preferredPharmaModel.findOne({
        $and:[{deletd: false},{contact: this.contact}]
    });
    if (/^[0]?[789]\d{9}$/.test(this.contact))
    {
    if(!pharmaExist)
    return next();
    else{
        throw new Error("Pharmacy Already Exist");
    }
}
else {
    throw new Error("Invalid phone number");
  }
})


const preferredPharmaModel = model(preferredPharma,preferredPharmaSchema);

export default preferredPharmaModel;