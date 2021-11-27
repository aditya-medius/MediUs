"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_path = process.env.DB_PATH;
mongoose_1.default.connect(db_path, () => {
    console.log("Connected to MongoDBdatabase");
});
module.exports = { dbConnection: mongoose_1.default };
