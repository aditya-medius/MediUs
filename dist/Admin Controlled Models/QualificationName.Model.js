"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const qualificationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Qualification name is required"],
    },
    abbreviation: {
        type: String,
        required: [true, "Qualification abbreviation is required"],
    },
    del: {
        deleted: {
            type: Boolean,
            default: false,
        },
        deltedAt: {
            type: Date,
        },
    },
});
const qualificationNameModel = (0, mongoose_1.model)(schemaNames_1.qualificationNames, qualificationSchema);
exports.default = qualificationNameModel;
