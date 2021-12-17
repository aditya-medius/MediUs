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
const Hospital_auth_1 = require("../authentication/Hospital.auth");
const hospitalController = __importStar(require("../Controllers/Hospital.Controller"));
const hospitalRouter = express_1.default.Router();
hospitalRouter.get("/", Hospital_auth_1.authenticateHospital, hospitalController.getAllHospitalsList);
hospitalRouter.post("/", hospitalController.createHospital);
hospitalRouter.post("/deleteHospital", Hospital_auth_1.authenticateHospital, hospitalController.deleteHospital);
hospitalRouter.post("/updateHospital", Hospital_auth_1.authenticateHospital, hospitalController.updateHospital);
hospitalRouter.post("/anemity", Hospital_auth_1.authenticateHospital, hospitalController.createHospitalAnemity);
// hospitalRouter.post("/speciality",authenticateHospital,hospitalController.addHospitalSpeciality);
hospitalRouter.post("/findHospitalBySpecialityOrBodyPart/:term", hospitalController.searchHospital);
//ADD DOCTOR TO THE HOSPITAL
hospitalRouter.post("/removeDoctor", Hospital_auth_1.authenticateHospital, hospitalController.removeDoctor);
exports.default = hospitalRouter;
