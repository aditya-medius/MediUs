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
exports.createHospitalAnemity = exports.createHospital = exports.getAllHospitalsList = void 0;
const Anemities_Model_1 = __importDefault(require("../Models/Anemities.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const response_1 = require("../Services/response");
const jwt = __importStar(require("jsonwebtoken"));
const getAllHospitalsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hospitalList = yield Hospital_Model_1.default.find();
        return (0, response_1.successResponse)(hospitalList, "Successfully fetched Hospital's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllHospitalsList = getAllHospitalsList;
//create a hospital
const createHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        //  let anemityObj=await new anemityModel(body).save();
        //  let specialisedObj=await new specialityModel(body).save();
        let hospitalObj = yield new Hospital_Model_1.default(body).save();
        (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Hospital created successfully", res);
        };
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createHospital = createHospital;
const createHospitalAnemity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let anemityObj = yield new Anemities_Model_1.default(body).save();
        jwt.sign(anemityObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Address has been successfully added", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createHospitalAnemity = createHospitalAnemity;
