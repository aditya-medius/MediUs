"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const paymentSchema = new mongoose_1.Schema({
    mode: [{
            type: String,
            required: true
        }]
});
const paymentModel = (0, mongoose_1.model)(schemaNames_1.payment, paymentSchema);
exports.default = paymentModel;
