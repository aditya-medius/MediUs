"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_path = process.env.DB_PATH;
const Conn = mongoose_1.default.createConnection();
let connection;
(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect(db_path, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Connected to MongoDBdatabase");
    }));
    const Conn = mongoose_1.default.createConnection();
    // connect to database
    yield Conn.openUri(process.env.DB_PATH);
    // Conn.collection("special").find();
    module.exports = Conn;
}))();
// export connection;
// connect to database
// Conn.collection("special").find();
