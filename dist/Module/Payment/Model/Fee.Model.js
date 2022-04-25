"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../../../Services/schemaNames");
const feeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    feeAmount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const feeModel = (0, mongoose_1.model)(schemaNames_1.fee, feeSchema);
exports.default = feeModel;
