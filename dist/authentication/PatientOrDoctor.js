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
exports.authenticateHospital = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../Services/response");
const authenticateHospital = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("auth-header");
        const patient = jsonwebtoken_1.default.verify(authHeader, process.env.SECRET_PATIENT_KEY);
        const doctor = jsonwebtoken_1.default.verify(authHeader, process.env.SECRET_DOCTOR_KEY);
        req.currentPatient = patient._id;
        req.currentDoctor = doctor._id;
        next();
    }
    catch (error) {
        error.message = "Forbidden";
        return (0, response_1.errorResponse)(error, res, 403);
    }
});
exports.authenticateHospital = authenticateHospital;
