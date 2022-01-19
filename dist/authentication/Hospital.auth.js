"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateHospital = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateHospital = (req, res, next) => {
    try {
        const authHeader = req.header("auth-header");
        const data = jsonwebtoken_1.default.verify(authHeader, process.env.SECRET_HOSPITAL_KEY);
        req.currentHospital = data._id;
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.authenticateHospital = authenticateHospital;
