"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const LocalitySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    }
});
const LocalityModel = (0, mongoose_1.model)(schemaNames_1.locality, LocalitySchema);
exports.default = LocalityModel;
