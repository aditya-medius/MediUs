"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const Helpers_1 = require("../Services/Helpers");
const overTheCounterPaymentSchema = new mongoose_1.Schema({
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    },
    hospitalId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    },
    createdBy: {
        type: String,
        enum: [Helpers_1.UserType.HOSPITAL, Helpers_1.UserType.DOCTOR]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const overTheCounterModel = (0, mongoose_1.model)(schemaNames_1.overTheCounterPayment, overTheCounterPaymentSchema);
exports.default = overTheCounterModel;
