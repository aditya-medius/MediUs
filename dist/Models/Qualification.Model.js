"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const validator_1 = __importDefault(require("validator"));
const qualificationSchema = new mongoose_1.Schema({
    qualificationName: {
        type: String,
        required: [true, "Qualification name is required"],
    },
    certificationOrganisation: {
        type: String,
        required: [true, "Certification Organisation is required"],
    },
    duration: {
        type: {
            from: {
                type: Date,
                required: true,
            },
            till: {
                type: Date,
                required: true,
            },
        },
        required: [true, "Duration is required"],
    },
    email: {
        type: String,
        // required: [true, "Email is required"],
        validate: [validator_1.default.isEmail, "Email isn't valid"],
        // unique: true,
    },
});
const qualificationModel = (0, mongoose_1.model)(schemaNames_1.qualification, qualificationSchema);
exports.default = qualificationModel;
