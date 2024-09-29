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
const specialityDiseaseSchema = new mongoose_1.Schema({
    speciality: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: schemaNames_1.specialization,
    },
    disease: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            uniqueItems: true,
            required: true,
            ref: schemaNames_1.disease,
        },
    ],
});
specialityDiseaseSchema.path("disease").validate(function (disease) {
    if (disease.length < 1) {
        return false;
    }
    return true;
}, "Add at least one disease");
const specialityDiseaseModel = (0, mongoose_1.model)(schemaNames_1.specialityDisease, specialityDiseaseSchema);
exports.default = specialityDiseaseModel;
