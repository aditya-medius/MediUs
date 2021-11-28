"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likesSchema = new mongoose_1.Schema({
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "doctor",
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "patient",
    },
});
const likes = (0, mongoose_1.model)("likes", likesSchema);
exports.default = likes;
