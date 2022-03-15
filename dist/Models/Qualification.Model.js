"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
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
        // required: [true, "Duration is required"],
    },
    email: {
        type: String,
        // required: [true, "Email is required"],
        // validate: [validator.isEmail, "Email isn't valid"],
        // unique: true,
    },
});
const qualificationModel = (0, mongoose_1.model)(schemaNames_1.qualification, qualificationSchema);
exports.default = qualificationModel;
