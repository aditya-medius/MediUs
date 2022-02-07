"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const servicesSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    serviceType: {
        type: String,
        enum: {
            values: ["Primary", "Secondary"],
            message: "value not supported",
        },
    },
});
const servicesModel = (0, mongoose_1.model)(schemaNames_1.services, servicesSchema);
exports.default = servicesModel;
