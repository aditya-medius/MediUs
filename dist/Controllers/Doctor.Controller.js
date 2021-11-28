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
exports.createDoctor = exports.getAllDoctorsList = void 0;
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const response_1 = require("../Services/response");
const getAllDoctorsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorList = yield Doctors_Model_1.default.find();
        (0, response_1.successResponse)(doctorList, "Successfully fetched doctor's list", res);
    }
    catch (error) {
        (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllDoctorsList = getAllDoctorsList;
const createDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorObj = yield new Doctors_Model_1.default(req.body).save();
        (0, response_1.successResponse)(doctorObj, "Doctor profile successfully created", res);
    }
    catch (error) {
        (0, response_1.errorResponse)(error, res);
    }
});
exports.createDoctor = createDoctor;
