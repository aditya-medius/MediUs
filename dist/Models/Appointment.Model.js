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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaNames_1 = require("../Services/schemaNames");
// import schemaOptions from "../Services/schemaOptions";
const appointmentSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.patient
    },
    doctors: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.doctor
    },
    hospital: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.hospital
    },
    time: {
        type: {
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
                required: true
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
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        },
        required: true,
    },
    done: {
        type: Boolean,
        default: false
    },
    cancelled: {
        type: Boolean,
        default: false
    },
});
const appointmentModel = (0, mongoose_1.model)(schemaNames_1.appointment, appointmentSchema);
exports.default = appointmentModel;
