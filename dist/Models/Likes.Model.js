"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaNames_1 = require("../Services/schemaNames");
const likeSchema = new mongoose_1.Schema({
    doctor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.doctor,
    },
    likedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: "reference",
    },
    reference: {
        type: String,
        enum: [schemaNames_1.patient, schemaNames_1.hospital, schemaNames_1.suvedha],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    unlike: {
        type: Boolean,
    },
});
const likeModel = (0, mongoose_1.model)(schemaNames_1.like, likeSchema);
exports.default = likeModel;
