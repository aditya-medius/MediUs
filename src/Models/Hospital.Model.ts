import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import 
{ 
  speciality, doctor, address, payment, anemity, hospital, treatmentType, openingHour, specialization
} 
 from "../Services/schemaNames";
const hospitalSchema = new Schema({
  name:{
    type: String,
    required: true
  },
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
      ref: specialization
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
  payment:
    [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: payment
    }],

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
  },
  // location:{
  //     "type":"Point",
  //     "coordinates":['lat','lng']
  //   }

});


hospitalSchema.pre("save", async function (next) {
  const hospitalExist = await hospitalModel.findOne({
    $and: [
      {
        $or: [
          { contactNumber: this.contactNumber },
        ],
      },
      { deleted: false },
    ],
  });
  if (/^[0]?[789]\d{9}$/.test(this.contactNumber)) {
    if (!hospitalExist) {
      return next();
    } else {
      throw new Error(
        "Hospital already exist. Select a different phone number"
      );
    }
  } else {
    throw new Error("Invalid phone number");
  }
});


hospitalSchema.pre("findOneAndUpdate", async function (next) {
  let updateQuery: any = this.getUpdate();
  updateQuery = updateQuery["$set"];
  if ("contactNumber" in updateQuery) {
    const query = this.getQuery();

    const hospitalExist = await this.model.findOne({
      _id: { $ne: query._id },
      $or: [
        { contactNumber: updateQuery.contactNumber },
      ],
    });
    if (hospitalExist) {
      throw new Error(
        "Hospital alredy exist. Select a different contact number"
      );
    } else {
      return next();
    }
  }
  return next();
});






const hospitalModel = model(hospital, hospitalSchema);

export default hospitalModel;
