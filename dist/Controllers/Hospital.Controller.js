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
exports.createHospital = exports.getAllHospitalsList = void 0;
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const response_1 = require("../Services/response");
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
const createHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hospitalObj = yield new Hospital_Model_1.default(req.body).save();
        return (0, response_1.successResponse)(hospitalObj, "Doctor profile successfully created", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createHospital = createHospital;
