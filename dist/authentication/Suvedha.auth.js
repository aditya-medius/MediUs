"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSuvedha = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateSuvedha = (req, res, next) => {
    try {
        const authHeader = req.header("auth-header");
        console.log("ONEONEONEONEONE", authHeader);
        console.log("\n\n\nprocesss", process.env.SECRET_SUVEDHA_KEY);
        const data = jsonwebtoken_1.default.verify(authHeader, process.env.SECRET_SUVEDHA_KEY);
        console.log("\nn\n\n\n\ndhbdsdsds", data);
        req.currentSuvedha = data._id;
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.authenticateSuvedha = authenticateSuvedha;
