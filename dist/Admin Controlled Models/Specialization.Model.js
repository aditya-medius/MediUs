"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const specialitySchema = new mongoose_1.Schema({
    specialityName: {
        type: String,
        required: true,
    },
});
const speciality = (0, mongoose_1.model)("speciality", specialitySchema);
exports.default = speciality;
