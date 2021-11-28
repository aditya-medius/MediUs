"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaOptions_1 = __importDefault(require("../Services/schemaOptions"));
const patientSchema = new mongoose_1.Schema(Object.assign({}, schemaOptions_1.default));
const patient = (0, mongoose_1.model)("patient", patientSchema);
exports.default = patient;
