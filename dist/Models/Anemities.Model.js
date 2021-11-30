"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const anemitySchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    anemityType: {
        type: String,
        enum: {
            values: ["Primary", "Secondary"],
            message: "value not supported",
        },
    },
});
const anemityModel = (0, mongoose_1.model)(schemaNames_1.anemity, anemitySchema);
exports.default = anemityModel;
