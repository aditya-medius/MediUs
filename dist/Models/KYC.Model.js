"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const kycSchema = new mongoose_1.Schema({
    panCard: {
        type: String,
        required: true,
        unique: true,
    },
    bankName: {
        type: String,
    },
    bankAccountNumber: {
        type: String,
        unique: true,
    },
    IFSC: {
        type: String,
    },
    adhaarCard: {
        type: String,
        required: true,
        minlength: 12,
        unique: true,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const kycModel = (0, mongoose_1.model)(schemaNames_1.kycDetails, kycSchema);
exports.default = kycModel;
