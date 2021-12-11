"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const doctorTypeSchema = new mongoose_1.Schema({
    doctorType: {
        type: String,
        required: true,
    },
});
const doctorTypeModel = (0, mongoose_1.model)(schemaNames_1.doctorType, doctorTypeSchema);
exports.default = doctorTypeModel;
