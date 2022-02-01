"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const orderSchema = new mongoose_1.Schema({
    receipt: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});
const orderModel = (0, mongoose_1.model)(schemaNames_1.order, orderSchema);
exports.default = orderModel;
