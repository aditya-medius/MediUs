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
const prescriptionSchema = new mongoose_1.Schema({
    doctorId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: schemaNames_1.doctor,
    },
    hospitalId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: schemaNames_1.hospital,
    },
    patient: {
        type: mongoose_1.default.Types.ObjectId,
        ref: schemaNames_1.patient,
    },
    pharma: {
        type: mongoose_1.default.Types.ObjectId,
        ref: schemaNames_1.preferredPharma,
    },
    prescription: {
        data: Buffer,
        contentType: String,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});
const prescriptionModel = (0, mongoose_1.model)(schemaNames_1.prescription, prescriptionSchema);
exports.default = prescriptionModel;
