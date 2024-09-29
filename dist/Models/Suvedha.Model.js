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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaNames_1 = require("../Services/schemaNames");
const schemaOptions_1 = __importDefault(require("../Services/schemaOptions"));
const suvedhaSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, schemaOptions_1.default), { password: {
        type: String,
    }, adhaarCard: {
        type: String,
        length: 12,
    }, alternateNumber: {
        type: String,
    }, address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.address,
    }, location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        // longitude first then latitude
        coordinates: {
            type: [Number],
        },
    }, paymentDetails: {
        accountHolderName: {
            type: String,
        },
        accountNumber: {
            type: String,
        },
        bankName: {
            type: String,
        },
        IFSCNumber: {
            type: String,
        },
        panNumber: {
            type: String,
        },
    }, documents: {
        adhaar: {
            type: String,
        },
        panCard: {
            type: String,
        },
    } }));
suvedhaSchema.index({ coordinates: "2dsphere" });
const suvedhaModel = (0, mongoose_1.model)(schemaNames_1.suvedha, suvedhaSchema);
exports.default = suvedhaModel;
