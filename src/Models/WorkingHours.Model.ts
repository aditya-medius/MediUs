import mongoose, { Schema, model } from "mongoose";
import { doctor, hospital, workingHour } from "../Services/schemaNames";

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
    },
    required: true,
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
    },
    required: true,
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
    },
    required: true,
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
    },
    required: true,
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
    },
    required: true,
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
    },
    required: true,
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
    },
    required: true,
  },
  byHospital: {
    type: Boolean,
    default: false,
  },
});

workingHoursSchema.pre("save", async function (next) {
  if (this.byHospital) {
    next();
  } else {
    console.log("thid: ", this);
    if (!this.hospitalDetails || !this.doctorDetails) {
      throw new Error("Doctor and Hospital details are required");
    }
  }
});
const workingHourModel = model(workingHour, workingHoursSchema);

export default workingHourModel;
