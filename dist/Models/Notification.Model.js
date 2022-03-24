"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const notificationsSchema = new mongoose_1.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const notificationsModel = (0, mongoose_1.model)(schemaNames_1.notifications, notificationsSchema);
exports.default = notificationsModel;
