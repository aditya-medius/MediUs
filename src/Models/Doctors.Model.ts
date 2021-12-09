import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import {
  doctor,
  hospital,
  like,
  qualification,
  speciality,
  workingHour,
  treatmentType,
} from "../Services/schemaNames";
const doctorSchema = new Schema({
  ...schemaOptions,
  hospitalDetails: [
    {
      hospital: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: hospital,
      },
      workingHours: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: workingHour,
      },
      consultationFee: {
        min: {
          required: true,
          type: Number,
        },
        max: {
          required: true,
          type: Number,
        },
      },
    },
  ],
  registrationDate: {
    type: Date,
    required: true,
  },
  specialization: [
    {
      type: Schema.Types.ObjectId,
      ref: speciality,
    },
  ],
  panCard: {
    type: String,
    required: true,
  },
  adhaarCard: {
    type: String,
    required: true,
    minlength: 12,
  },
  qualification: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: qualification,
    },
  ],

  liked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: like,
  },
  treatmentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: treatmentType,
  },
});

doctorSchema.pre("save", async function (next) {
  const profileExist = await doctorModel.findOne({
    $and: [
      {
        $or: [
          {
            email: this.email,
          },
          { phoneNumber: this.phoneNumber },
        ],
      },
      { deleted: false },
    ],
  });
  if (/^[0]?[789]\d{9}$/.test(this.phoneNumber)) {
    if (!profileExist) {
      return next();
    } else {
      throw new Error(
        "Profile alredy exist. Select a different phone number and email"
      );
    }
  } else {
    throw new Error("Invalid phone number");
  }
});

doctorSchema.pre("findOneAndUpdate", async function (next) {
  let updateQuery: any = this.getUpdate();
  updateQuery = updateQuery["$set"];
  if (
    "phoneNumber" in updateQuery ||
    "email" in updateQuery ||
    "panCard" in updateQuery ||
    "adhaarCard" in updateQuery
  ) {
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
        "Profile alredy exist. Select a different phone number and email"
      );
    } else {
      return next();
    }
  }
  return next();
});

// const mongooseEventList = ["find", "findOne"];

// mongooseEventList.forEach((event: any) => {
//   doctorSchema.pre(event, async function (next) {
//     this.select({
//       password: 0,
//       panCard: 0,
//       adhaarCard: 0,
//       verified: 0,
//       registrationDate: 0,
//       DOB: 0,
//     });
//     return next();
//   });
// });
const doctorModel = model(doctor, doctorSchema);

export default doctorModel;
