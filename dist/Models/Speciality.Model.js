"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const specialitySchema = new mongoose_1.Schema({
    speciality: {
        type: String,
        required: true,
    },
    bodyPart: [
        {
            type: String,
            required: true,
        },
    ],
    disease: {
        type: String,
        required: true,
    },
});
const specialityModel = (0, mongoose_1.model)(schemaNames_1.speciality, specialitySchema);
exports.default = specialityModel;
