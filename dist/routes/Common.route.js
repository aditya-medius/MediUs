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
const middlewareHelper_1 = require("../Services/middlewareHelper");
const Utils_1 = require("../Services/Utils");
const commonRouter = express_1.default.Router();
const upload = (0, Utils_1.initUpload)("admin");
commonRouter.post("/uploadImage", (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient, Admin_auth_1.authenticateAdmin), upload.single("profileImage"), mediaController.uploadImage);
exports.default = commonRouter;
