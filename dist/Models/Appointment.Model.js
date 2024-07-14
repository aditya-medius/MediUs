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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaNames_1 = require("../Services/schemaNames");
const Utils_1 = require("../Services/Utils");
const WorkingHours_Model_1 = __importDefault(require("./WorkingHours.Model"));
const Patient_1 = require("../Services/Patient");
// import schemaOptions from "../Services/schemaOptions";
const appointmentSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.patient,
    },
    doctors: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.doctor,
    },
    hospital: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.hospital,
    },
    time: {
        type: {
            from: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [
                            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                            19, 20, 21, 22, 23,
                        ],
                    },
                    division: {
                        type: Number,
                    },
                },
                required: true,
            },
            till: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [
                            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                            19, 20, 21, 22, 23,
                        ],
                    },
                    division: {
                        type: Number,
                    },
                },
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
    cancelled: {
        type: Boolean,
        default: false,
    },
    subPatient: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.subPatient,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    rescheduled: {
        type: Boolean,
        default: false,
    },
    appointmentToken: {
        type: Number,
    },
    appointmentId: {
        type: String,
    },
    Type: {
        type: String,
        enum: ["Offline", "Online"],
    },
    appointmentType: {
        type: String,
        enum: [Patient_1.AppointmentType.FRESH, Patient_1.AppointmentType.FOLLOW_UP],
        default: Patient_1.AppointmentType.FRESH
    },
    appointmentStatus: {
        type: String,
        enum: [Patient_1.AppointmentStatus.SCHEDULED, Patient_1.AppointmentStatus.PRESENT, Patient_1.AppointmentStatus.CONSULTED, Patient_1.AppointmentStatus.ABSENT],
        default: Patient_1.AppointmentStatus.SCHEDULED
    },
    // Kisne appointments book ki hai. User, hospital or suvedha
    appointmentBookedBy: {
        type: String,
    },
});
appointmentSchema.post("save", function (result) {
    return __awaiter(this, void 0, void 0, function* () {
        let { doctors, hospital } = result;
        let { workingHour, day } = (0, Utils_1.formatWorkingHourDayForAppointment)(result);
        let updateQuery = {};
        if (result.done || result.cancelled) {
            /* Agar doctor ki appointment DONE ya CANCEL hone pe
               appointmentBooked ko decrement krna hai to isko uncomment krdo
             */
            // updateQuery[`${day}.appointmentsBooked`] = -1;
            // await decrementWorkingHoursAppointmentBooked(
            //   {
            //     doctorDetails: doctors,
            //     hospitalDetails: hospital,
            //     ...workingHour,
            //   },
            //   {
            //     $inc: updateQuery,
            //   }
            // );
        }
        else {
            updateQuery[`${day}.appointmentsBooked`] = 1;
            yield incrementWorkingHoursAppointmentBooked(Object.assign({ doctorDetails: doctors, hospitalDetails: hospital }, workingHour), {
                $inc: updateQuery,
            });
        }
    });
});
let incrementWorkingHoursAppointmentBooked = (query, increment) => __awaiter(void 0, void 0, void 0, function* () {
    yield WorkingHours_Model_1.default.findOneAndUpdate(query, increment);
});
let decrementWorkingHoursAppointmentBooked = (query, decrement) => __awaiter(void 0, void 0, void 0, function* () {
    yield WorkingHours_Model_1.default.findOneAndUpdate(query, decrement);
});
const appointmentModel = (0, mongoose_1.model)(schemaNames_1.appointment, appointmentSchema);
exports.default = appointmentModel;
