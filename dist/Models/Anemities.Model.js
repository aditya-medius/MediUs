"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
const anemity = (0, mongoose_1.model)("anemity", anemitySchema);
exports.default = anemity;
