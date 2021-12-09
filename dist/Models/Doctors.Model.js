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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaOptions_1 = __importDefault(require("../Services/schemaOptions"));
const schemaNames_1 = require("../Services/schemaNames");
const doctorSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, schemaOptions_1.default), { hospitalDetails: [
        {
            hospital: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: schemaNames_1.hospital,
            },
            workingHours: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: schemaNames_1.workingHour,
            },
            consultationFee: {
                min: {
                    type: Number,
                },
                max: {
                    type: Number,
                },
            },
        },
    ], registrationDate: {
        type: Date,
        required: true,
    }, specialization: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: schemaNames_1.speciality,
        },
    ], panCard: {
        type: String,
        required: true,
    }, adhaarCard: {
        type: String,
        required: true,
        minlength: 12,
    }, qualification: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: schemaNames_1.qualification,
        },
    ], liked: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.like,
    } }));
const doctorModel = (0, mongoose_1.model)(schemaNames_1.doctor, doctorSchema);
exports.default = doctorModel;
