"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const stateSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
    },
    state_id: {
        type: String,
    },
});
const stateModel = (0, mongoose_1.model)(schemaNames_1.state, stateSchema);
exports.default = stateModel;
