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
  specialization,
  BodyPart,
} from "../Services/schemaNames";
const doctorSchema = new Schema(
  {
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
        ref: specialization,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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

// For later
// doctorSchema.virtual("bodyPart", {
//   ref: "specialities",
//   localField: "specialization",
//   foreignField: "speciality",
//   justOne: false,
// });
const doctorModel = model(doctor, doctorSchema);

export default doctorModel;
