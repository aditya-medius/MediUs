"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const bodyPartSchema = new mongoose_1.Schema({
    bodyPart: {
        type: String,
        required: true,
    },
});
const bodyPartModel = (0, mongoose_1.model)(schemaNames_1.BodyPart, bodyPartSchema);
exports.default = bodyPartModel;
