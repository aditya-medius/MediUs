import mongoose, { Schema, model } from "mongoose";
import { workingHour } from "../Services/schemaNames";
import * as Joi from "joi";
const workingHoursSchema = new Schema({
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
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          division: {
            type: Number,
            // 0 = AM, 1 = PM
            enum: [0, 1],
          },
        },
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          division: {
            type: Number,
            // 0 = AM, 1 = PM
            enum: [0, 1],
          },
        },
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
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        division: {
          type: Number,
          // 0 = AM, 1 = PM
          enum: [0, 1],
        },
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          division: {
            type: Number,
            // 0 = AM, 1 = PM
            enum: [0, 1],
          },
        },
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
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        division: {
          type: Number,
          // 0 = AM, 1 = PM
          enum: [0, 1],
        },
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          division: {
            type: Number,
            // 0 = AM, 1 = PM
            enum: [0, 1],
          },
        },
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
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        division: {
          type: Number,
          // 0 = AM, 1 = PM
          enum: [0, 1],
        },
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          division: {
            type: Number,
            // 0 = AM, 1 = PM
            enum: [0, 1],
          },
        },
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
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        division: {
          type: Number,
          // 0 = AM, 1 = PM
          enum: [0, 1],
        },
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          division: {
            type: Number,
            // 0 = AM, 1 = PM
            enum: [0, 1],
          },
        },
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
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        division: {
          type: Number,
          // 0 = AM, 1 = PM
          enum: [0, 1],
        },
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          division: {
            type: Number,
            // 0 = AM, 1 = PM
            enum: [0, 1],
          },
        },
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
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        division: {
          type: Number,
          // 0 = AM, 1 = PM
          enum: [0, 1],
        },
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          division: {
            type: Number,
            // 0 = AM, 1 = PM
            enum: [0, 1],
          },
        },
      },
    },
    required: true,
  },
});
const workingHourModel = model(workingHour, workingHoursSchema);

export default workingHourModel;
