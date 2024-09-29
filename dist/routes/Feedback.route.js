"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Doctor_auth_1 = require("../authentication/Doctor.auth");
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const Patient_auth_1 = require("../authentication/Patient.auth");
const middlewareHelper_1 = require("../Services/middlewareHelper");
const feedbackController = __importStar(require("../Controllers/Feedback.Controller"));
const feedbackRouter = express_1.default.Router();
feedbackRouter.post("/submitfeedback", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), feedbackController.submitFeedback);
feedbackRouter.get("/getAllFeedbacks", (0, middlewareHelper_1.oneOf)(Patient_auth_1.authenticatePatient, Hospital_auth_1.authenticateHospital, Doctor_auth_1.authenticateDoctor), feedbackController.getAllFeedbacks);
exports.default = feedbackRouter;
