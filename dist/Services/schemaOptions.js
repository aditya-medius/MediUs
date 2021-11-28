"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaOptions = {
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: true,
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
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    Appointments: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "appointment",
    },
    verified: {
        type: Boolean,
        default: false,
    },
};
exports.default = schemaOptions;
