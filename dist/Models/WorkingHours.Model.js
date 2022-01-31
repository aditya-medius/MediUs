"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaNames_1 = require("../Services/schemaNames");
let divisionArray = Array.from(Array(60).keys());
const workingHoursSchema = new mongoose_1.Schema({
    doctorDetails: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.doctor,
        // required: true,
    },
    hospitalDetails: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.hospital,
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
// workingHoursSchema.pre("find", async function (next) {
//   const query = this.getQuery();
//   console.log("query:", query);
//   let workingHours;
//   workingHours = await this.model.find(query);
//   console.log("working hours:", workingHours);
//   next();
// });
// ["find", "findOne", "aggregate"].forEach((e: string) => {
//   workingHoursSchema.post(e, function (result) {
//     console.log("result:", result);
//   });
// });
// const handleDeletedProfiles = async (data: any) => {
// };
workingHoursSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.byHospital) {
            next();
        }
        else {
            if (!this.hospitalDetails || !this.doctorDetails) {
                throw new Error("Doctor and Hospital details are required");
            }
        }
    });
});
const workingHourModel = (0, mongoose_1.model)(schemaNames_1.workingHour, workingHoursSchema);
exports.default = workingHourModel;
