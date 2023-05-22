import mongoose, { Schema, model } from "mongoose";
import { type } from "os";
import schemaOptions from "../Services/schemaOptions";
import { patient, doctor, hospital, address } from "../Services/schemaNames";
import hospitalModel from "./Hospital.Model";
import doctorModel from "./Doctors.Model";

const patientSchema = new Schema({
  ...schemaOptions,
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
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: address,
  },
  firebaseToken: {
    type: String,
    // required: true,
  },
});

patientSchema.pre("save", async function (next) {
  const profileExist = await patientModel.findOne({
    $and: [
      {
        $or: [
          // {
          //   email: this.email,
          // },
          { phoneNumber: this.phoneNumber },
        ],
      },
      { deleted: false },
    ],
  });

  const hospitalExist = await hospitalModel.findOne({
    $and: [
      {
        $or: [
          // {
          //   email: this.email,
          // },
          { contactNumber: this.phoneNumber },
        ],
      },
      { deleted: false },
    ],
  });

  const doctorExist = await doctorModel.findOne({
    $and: [
      {
        $or: [
          // {
          //   email: this.email,
          // },
          { phoneNumber: this.phoneNumber },
        ],
      },
      { deleted: false },
    ],
  });
  if (/^[0]?[6789]\d{9}$/.test(this.phoneNumber)) {
    if (
      !(profileExist || hospitalExist || doctorExist) ||
      this.phoneNumber == "9999999999"
    ) {
      return next();
    } else {
      throw new Error(
        "Profile alredy exist. Select a different Phone Number and Email"
      );
    }
  } else {
    throw new Error("Invalid Phone Number");
  }
});

patientSchema.pre("findOneAndUpdate", async function (next) {
  let updateQuery: any = this.getUpdate();
  updateQuery = updateQuery["$set"];
  if ("phoneNumber" in updateQuery || "email" in updateQuery) {
    const query = this.getQuery();

    const profileExist = await this.model.findOne({
      _id: { $ne: query._id },
      $or: [
        {
          email: updateQuery.email,
        },
        { phoneNumber: updateQuery.phoneNumber },
      ],
    });
    if (profileExist) {
      throw new Error(
        "Profile alredy exist. Select a different Phone Number and Email"
      );
    } else {
      return next();
    }
  }
  return next();
});

const patientModel = model(patient, patientSchema);

export default patientModel;
