import mongoose, { Schema, model } from "mongoose";
import schemaOptions from "../Services/schemaOptions";
import _ from "lodash";
import workingHourModel from "./WorkingHours.Model";
import moment from "moment";
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
  kycDetails,
  media,
} from "../Services/schemaNames";
import mediaModel from "./Media.model";
const doctorSchema = new Schema(
  {
    ...schemaOptions,
    hospitalDetails: [
      {
        type: {
          hospital: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Hospital is required"],
            ref: hospital,
          },
          workingHours: {
            type: mongoose.Schema.Types.ObjectId,
            // required: [true, "working hours is required"],
            ref: workingHour,
          },
          consultationFee: {
            min: {
              required: [true, "Minimum consultation fee is required"],
              type: Number,
            },
            max: {
              required: [true, "Maximum consultation fee is required"],
              type: Number,
            },
          },
        },
      },
    ],
    registration: {
      type: {
        registrationNumber: {
          type: String,
        },
        registrationCouncil: {
          type: String,
        },
        registrationDate: {
          type: Date,
        },
      },
      // required: true,
    },
    specialization: [
      {
        type: Schema.Types.ObjectId,
        ref: specialization,
      },
    ],
    KYCDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: kycDetails,
      // required: [true, "KYC details are required"],
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
    overallExperience: {
      type: mongoose.Schema.Types.Mixed,
      // required: true,
    },
    image: {
      type: String,
      default: "static/user/default.png",
      // ref: media,
    },

    // // Admin is field edit karega aur koi nhi
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

["find", "findOne"].forEach((e: string) => {
  doctorSchema.pre(e, async function (next) {
    if (Object.keys(this.getQuery()).includes("adminSearch")) {
      this.where({ deleted: false });
    } else {
      this.where({ deleted: false, verified: false });
    }
    this.populate("KYCDetails");
  });
});

doctorSchema.post("findOne", async function (result) {
  if (result && result.overallExperience) {
    const exp = moment(new Date(result.overallExperience));
    const currentDate = moment(new Date());

    let overExp: any = currentDate.diff(exp, "years", true);
    if (overExp < 1) {
      overExp = `${currentDate.diff(exp, "months")} months`;
    } else {
      overExp = `${overExp} years`;
    }
    result.overallExperience = overExp;
    // result["image"]
  }
});
doctorSchema.post("find", async function (res) {
  res.forEach(async (result: any) => {
    if (result && result.overallExperience) {
      const exp = moment(new Date(result.overallExperience));
      const currentDate = moment(new Date());

      let overExp: any = currentDate.diff(exp, "years", true);
      if (overExp < 1) {
        overExp = `${currentDate.diff(exp, "months")} months`;
      } else {
        overExp = `${overExp} years`;
      }
      result.overallExperience = overExp;
    }
  });
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
    if (!profileExist || this.phoneNumber == "9999999999") {
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
        { panCard: updateQuery.panCard },
        { adhaarCard: updateQuery.panCard },
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

doctorSchema.pre("findOneAndUpdate", async function (next) {
  let updateQuery: any = this.getUpdate();
  updateQuery = updateQuery["$addToSet"];
  if (updateQuery && "hospitalDetails" in updateQuery) {
    const currentDoc = await this.model.findOne({ _id: this.getQuery()._id });
    const incomingHospitals = _.map(updateQuery.hospitalDetails, (e) =>
      e.hospital.toString()
    );
    const currentHospitals = _.map(currentDoc.hospitalDetails, (e) =>
      e.hospital.toString()
    );

    const combinedHospitals: Array<string> = [
      ...incomingHospitals,
      ...currentHospitals,
    ];
    if (combinedHospitals.length != new Set(combinedHospitals).size) {
      throw new Error("Cannot add same hospital twice");
    }
  }
  next();
});

// Hospital details validation
// doctorSchema.path("hospitalDetails").validate(function (hospital: any) {
//   if (hospital.length < 1) {
//     return false;
//   }
//   return true;
// }, "Hospital details are required");

doctorSchema.path("hospitalDetails").validate(function (hospital: any) {
  // if (hospital.lenght) {
  // }let element
  let element: any;
  if (hospital.length > 1) {
    for (let index = 0; index < hospital.length; index++) {
      for (let i = index + 1; i < hospital.length; i++) {
        if (hospital[i]) {
          if (
            hospital[index].hospital.toString() ==
            hospital[i].hospital.toString()
          ) {
            return false;
          }
        } else {
          return true;
        }
      }
    }
  }
  return true;
}, "Cannot enter same hospital twice");

// Specialization validation
doctorSchema.path("specialization").validate(function (specialization: any) {
  if (specialization.length < 1) {
    return false;
  }
  return true;
}, "specialization details are required");

// Qualification Validation
// doctorSchema.path("qualification").validate(function (qualification: any) {
//   if (qualification.length < 1) {
//     return false;
//   }
//   return true;
// }, "qualification details are required");

["remove", "findOneAndDelete"].forEach((e: string) => {
  doctorSchema.pre(e, async function (next) {
    const doctor: any = this;
    doctor.model(workingHour).remove({ doctorDetails: doctor._id }, next);
  });
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



// {
//   "password":"12334",
//   "KYCDetails":"61ebc11dcfd31a6c80e7d782",
//   "registration":{
//   "registrationNumber":"123456",
//   "registrationCouncil":"Registration Council",
//   "registrationDate":"Tue Nov 30 2021 22:47:17 GMT+0530 (India Standard Time)"
//   },
//   "email":"aditya.rawat.1119021@gmail.com",
//   "phoneNumber":"8826332445",
//   "DOB":"Tue Nov 30 2021 22:47:17 GMT+0530 (India Standard Time)",
//   "gender":"Male",
//   "lastName":"Rawat",
//   "firstName":"Aditya",
//   "specialization":["61b121c9d8d361e50fbe26ae"],
//   "qualification":["61d9204abf627811a19cdea8"],
//   "overallExperience":"{{experience}}"
// }