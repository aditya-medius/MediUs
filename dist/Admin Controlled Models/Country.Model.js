"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const countrySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
const countryModel = (0, mongoose_1.model)(schemaNames_1.country, countrySchema);
exports.default = countryModel;
