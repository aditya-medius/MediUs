"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const ownershipSchema = new mongoose_1.Schema({
    owner: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const ownershipModel = (0, mongoose_1.model)(schemaNames_1.ownership, ownershipSchema);
exports.default = ownershipModel;
