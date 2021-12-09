"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("./schemaNames");
const schemaOptions = {
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    DOB: {
        type: Date,
        required: true,
    },
    WhatsappNumber: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: [true, "Email already exist"],
    },
    password: {
        type: String,
        required: true,
    },
    appointments: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: schemaNames_1.appointment,
    },
    active: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
};
exports.default = schemaOptions;
