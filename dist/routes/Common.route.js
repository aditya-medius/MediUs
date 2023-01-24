"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.default = commonRouter;
