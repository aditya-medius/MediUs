"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatePatient = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticatePatient = (req, res, next) => {
    try {
        const authHeader = req.header("auth-header");
        const data = jsonwebtoken_1.default.verify(authHeader, process.env.SECRET_PATIENT_KEY);
        req.currentPatient = data._id;
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.authenticatePatient = authenticatePatient;
