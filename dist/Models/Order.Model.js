"use strict";
<<<<<<< HEAD
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
=======
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
>>>>>>> d4390c565c69b8571d8f9b113539d4133622576c
const schemaNames_1 = require("../Services/schemaNames");
const orderSchema = new mongoose_1.Schema({
    receipt: {
        type: String,
        required: true,
    },
<<<<<<< HEAD
=======
    amount: {
        type: Number,
        required: true,
    },
>>>>>>> d4390c565c69b8571d8f9b113539d4133622576c
    currency: {
        type: String,
        required: true,
    },
<<<<<<< HEAD
    amount: {
        type: Number,
=======
    appointmentDetails: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.appointment,
>>>>>>> d4390c565c69b8571d8f9b113539d4133622576c
        required: true,
    },
});
const orderModel = (0, mongoose_1.model)(schemaNames_1.order, orderSchema);
exports.default = orderModel;
