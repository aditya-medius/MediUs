"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const otpSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
});
const otpModel = (0, mongoose_1.model)(schemaNames_1.OTP, otpSchema);
exports.default = otpModel;
