"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const helplineNumberSchema = new mongoose_1.Schema({
    number: {
        type: String,
        required: true
    }
});
const helpLineNumberModel = (0, mongoose_1.model)(schemaNames_1.helplineNumber, helplineNumberSchema);
exports.default = helpLineNumberModel;
