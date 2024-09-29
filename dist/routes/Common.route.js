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
const express_1 = __importDefault(require("express"));
const mediaController = __importStar(require("../Controllers/Media.Controller"));
const Doctor_auth_1 = require("../authentication/Doctor.auth");
const Patient_auth_1 = require("../authentication/Patient.auth");
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const Admin_auth_1 = require("../authentication/Admin.auth");
const Suvedha_auth_1 = require("../authentication/Suvedha.auth");
const middlewareHelper_1 = require("../Services/middlewareHelper");
const Utils_1 = require("../Services/Utils");
const response_1 = require("../Services/response");
const hospitalService = __importStar(require("../Services/Hospital/Hospital.Service"));
const Common_Controller_1 = require("../Controllers/Common.Controller");
const commonRouter = express_1.default.Router();
let paths = "admin";
const upload = (0, Utils_1.initUpload)(paths);
commonRouter.post("/uploadImage", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient, Admin_auth_1.authenticateAdmin, Suvedha_auth_1.authenticateSuvedha), upload.single("profileImage"), (req, res) => {
    mediaController.uploadImage(req, res, paths);
});
commonRouter.post("/upload", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, response_1.successResponse)({ response: req.file }, "Success", res);
}));
commonRouter.get("/cities", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient, Admin_auth_1.authenticateAdmin, Suvedha_auth_1.authenticateSuvedha), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cities = yield hospitalService.getCitiesWhereHospitalsExist();
        return (0, response_1.successResponse)({ cities }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}));
commonRouter.get("/app/version/:app", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { app } = req.params;
        const status = process.env.APP_STATUS;
        console.log("status", status);
        let obj;
        switch (app) {
            case "medius_user": {
                obj = { version: parseInt(process.env.medius_user_version) };
                break;
            }
            case "medius_clinic": {
                obj = {
                    version: parseInt(process.env.medius_clinic_version),
                };
                break;
            }
            case "medius_doctor": {
                obj = {
                    version: parseInt(process.env.medius_doctor_version),
                };
                break;
            }
        }
        switch (status) {
            case "maintenance": {
                obj = Object.assign(Object.assign({}, obj), { status: false, msg: "Application is under maintenance" });
                break;
            }
            case "online": {
                obj = Object.assign(Object.assign({}, obj), { status: true, msg: "Application is online" });
                break;
            }
        }
        return (0, response_1.successResponse)(Object.assign({}, obj), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
}));
commonRouter.post("/test/notification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Utils_1.sendNotificationToDoctor)("", { body: "", title: "" });
    return (0, response_1.errorResponse)({ error: "Error" }, res);
}));
commonRouter.get("/otp/number", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { phoneNumber } = req.query;
    (0, Utils_1.sendOTPToPhoneNumber)(phoneNumber);
    return (0, response_1.successResponse)({}, "Success", res);
}));
commonRouter.put("/upate/profileImage", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), Common_Controller_1.SetProfileImage);
exports.default = commonRouter;
