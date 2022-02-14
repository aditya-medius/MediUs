import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import {
  speciality,
  doctor,
  address,
  payment,
  anemity,
  hospital,
  treatmentType,
  openingHour,
  specialization,
  workingHour,
  services,
} from "../Services/schemaNames";
import { errorResponse, successResponse } from "../Services/response";
import { query } from "express";
import doctorModel from "./Doctors.Model";
const hospitalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: address,
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: doctor,
    },
  ],
  specialisedIn: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: specialization,
    },
  ],
  anemity: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: anemity,
    },
  ],
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: services,
    },
  ],
  treatmentType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: treatmentType,
    },
  ],
  type: {
    type: String,
    required: true,
    enum: {
      values: ["Private", "Government"],
      message: "value not supported",
    },
  },
  payment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: payment,
    },
  ],

  deleted: {
    type: Boolean,
    default: false,
  },
  openingHour: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: workingHour,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  numberOfBed: {
    type: Number,
    // required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
});

hospitalSchema.pre("save", async function (next) {
  const hospitalExist = await hospitalModel.findOne({
    $and: [
      {
        $or: [{ contactNumber: this.contactNumber }],
      },
      { deleted: false },
    ],
  });
  if (/^[0]?[789]\d{9}$/.test(this.contactNumber)) {
    if (!hospitalExist || this.contactNumber == "9999999999") {
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
  let UpdateQuery: any = this.getUpdate();
  // console.log(UpdateQuery);
  if ("contactNumber" in UpdateQuery) {
    UpdateQuery = UpdateQuery["$set"];
    const query = this.getQuery();

    console.log("pupdate qbqbwL:", UpdateQuery);
    const hospitalExist = await this.model.findOne({
      _id: { $ne: query._id },
      $or: [{ contactNumber: UpdateQuery.contactNumber }],
    });
    if (hospitalExist) {
      throw new Error(
        "Hospital alredy exist. Select a different contact number"
      );
    } else {
      return next();
    }
  } else {
    return next();
  }
});

//check for number of bed

hospitalSchema.pre("findOneAndUpdate", async function (next) {
  let UpdateQuery: any = this.getUpdate();
  if ("numberOfBed" in UpdateQuery) {
    UpdateQuery = UpdateQuery["$set"];
    if (UpdateQuery.numberOfBed <= 0)
      throw new Error("Number of beds can't equal or less than zero");
    else return next();
  } else {
    return next();
  }
});
const hospitalModel = model(hospital, hospitalSchema);

export default hospitalModel;
