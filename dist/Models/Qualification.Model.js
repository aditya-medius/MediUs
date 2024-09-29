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
const qualificationSchema = new mongoose_1.Schema({
    qualificationName: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Qualification name is required"],
        ref: schemaNames_1.qualificationNames,
    },
    certificationOrganisation: {
        type: String,
        required: [true, "Certification Organisation is required"],
    },
    duration: {
        type: {
            from: {
                type: Date,
                required: true,
            },
            till: {
                type: Date,
                required: true,
            },
        },
        // required: [true, "Duration is required"],
    },
    email: {
        type: String,
        // required: [true, "Email is required"],
        // validate: [validator.isEmail, "Email isn't valid"],
        // unique: true,
    },
});
qualificationSchema.pre("find", function (next) {
    this.populate("qualificationName");
    next();
});
const qualificationModel = (0, mongoose_1.model)(schemaNames_1.qualification, qualificationSchema);
exports.default = qualificationModel;
