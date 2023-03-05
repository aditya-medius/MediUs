"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const specialitySchema = new mongoose_1.Schema({
    specialityName: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
    },
}, { timestamps: true });
const specialityModel = (0, mongoose_1.model)(schemaNames_1.specialization, specialitySchema);
exports.default = specialityModel;
