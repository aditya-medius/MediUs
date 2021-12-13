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
const addressSchema = new mongoose_1.Schema({
    city: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.city
    },
    state: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.state
    },
    locality: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.locality
    },
    country: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.country
    },
    addressLine_1: {
        type: String,
        required: true
    },
    addressLine_2: {
        type: String,
        // required: true
    }
});
const addressModel = (0, mongoose_1.model)(schemaNames_1.address, addressSchema);
exports.default = addressModel;
