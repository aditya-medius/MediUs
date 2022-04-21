import mongoose, { Schema, model } from "mongoose";
import { doctor, hospital, workingHour } from "../Services/schemaNames";
import { formatWorkingHour } from "../Services/WorkingHour.helper";
let divisionArray = Array.from(Array(60).keys());
const workingHoursSchema = new Schema({
  doctorDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: doctor,
    // required: true,
  },
  hospitalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: hospital,
    // required: true,
  },
  monday: {
    type: {
      working: {
        type: Boolean,
      },
      from: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 24,
            ],
          },
          division: {
            type: Number,
            enum: divisionArray,
          },
        },
      },
      till: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      capacity: {
        type: Number,
        required: true,
      },
      appointmentsBooked: {
        type: Number,
        default: 0,
      },
    },
    // required: true,
  },
  tuesday: {
    type: {
      working: {
        type: Boolean,
      },
      from: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      till: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      capacity: {
        type: Number,
        required: true,
      },
      appointmentsBooked: {
        type: Number,
        default: 0,
      },
    },
    // required: true,
  },
  wednesday: {
    type: {
      working: {
        type: Boolean,
      },
      from: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      till: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      capacity: {
        type: Number,
        required: true,
      },
      appointmentsBooked: {
        type: Number,
        default: 0,
      },
    },
    // required: true,
  },
  thursday: {
    type: {
      working: {
        type: Boolean,
      },
      from: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      till: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      capacity: {
        type: Number,
        required: true,
      },
      appointmentsBooked: {
        type: Number,
        default: 0,
      },
    },
    // required: true,
  },
  friday: {
    type: {
      working: {
        type: Boolean,
      },
      from: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      till: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      capacity: {
        type: Number,
        required: true,
      },
      appointmentsBooked: {
        type: Number,
        default: 0,
      },
    },
    // required: true,
  },
  saturday: {
    type: {
      working: {
        type: Boolean,
      },
      from: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      till: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      capacity: {
        type: Number,
        required: true,
      },
      appointmentsBooked: {
        type: Number,
        default: 0,
      },
    },
    // required: true,
  },
  sunday: {
    type: {
      working: {
        type: Boolean,
      },
      from: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      till: {
        time: {
          type: Number,
          // Time of day, like 1AM, 12PM, 10PM
          enum: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ],
        },
        division: {
          type: Number,
          enum: divisionArray,
        },
      },
      capacity: {
        type: Number,
        required: true,
      },
      appointmentsBooked: {
        type: Number,
        default: 0,
      },
    },
    // required: true,
  },
  byHospital: {
    type: Boolean,
    default: false,
  },

  deleted: {
    deletedAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
});

["remove", "findOneAndDelete"].forEach((e: string) => {
  workingHoursSchema.pre(e, async function (next) {
    this.set({ "deleted.deleteAt": Date.now(), "deleted.isDeleted": true });
  });
});

workingHoursSchema.pre("save", async function (next) {
  if (this.byHospital) {
    next();
  } else {
    // console.log("this:", this);
    // if (!this.hospitalId || !this.doctorDetails) {
    //   throw new Error("Doctor and Hospital details are required");
    // }
  }
});

["find", "findOne"].forEach((e: string) => {
  workingHoursSchema.pre(e, async function (next) {
    if (this.get("deleted")) {
      let query = {
        "deleted.isDeleted": false,
      };
      // this.where({ "deleted.isDeleted": false });
    }
    this.where({
      $and: [
        { "deleted.isDeleted": false },
        {
          $or: [
            { "monday.working": true },
            { "tuesday.working": true },
            { "wednesday.working": true },
            { "thursday.working": true },
            { "friday.working": true },
            { "saturday.working": true },
            { "sunday.working": true },
          ],
        },
      ],
    });
    next();
  });
});

const workingHourModel = model(workingHour, workingHoursSchema);

export default workingHourModel;
