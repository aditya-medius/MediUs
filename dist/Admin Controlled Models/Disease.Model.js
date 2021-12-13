"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const diseaseSchema = new mongoose_1.Schema({
    disease: {
        type: String,
        required: true,
    },
});
const diseaseModel = (0, mongoose_1.model)(schemaNames_1.disease, diseaseSchema);
exports.default = diseaseModel;
