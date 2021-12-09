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
        required: true,
    },
    duration: {
        from: {
            type: Date,
            required: true,
        },
        till: {
            type: Date,
            required: true,
        },
        required: true,
    },
});
const qualificationModel = (0, mongoose_1.model)(schemaNames_1.qualification, qualificationSchema);
exports.default = qualificationModel;
