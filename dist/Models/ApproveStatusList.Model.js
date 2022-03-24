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
const approveStatusSchema = new mongoose_1.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: "refFrom",
        required: true,
    },
    for: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: "refFor",
        required: true,
    },
    refFrom: {
        type: String,
        enum: [schemaNames_1.hospital, schemaNames_1.doctor],
        required: true,
    },
    refFor: {
        type: String,
        enum: [schemaNames_1.doctor, schemaNames_1.hospital],
        required: true,
    },
    approvedStatus: {
        type: String,
        default: "UnApproved",
        enum: ["Unapproved", "Approved"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const approveStatusModel = (0, mongoose_1.model)(schemaNames_1.approveStatus, approveStatusSchema);
exports.default = approveStatusModel;
