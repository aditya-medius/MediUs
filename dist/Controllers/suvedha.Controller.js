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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorInfo = exports.getDoctors = exports.createProfile = void 0;
const Doctor_Service_1 = require("../Services/Doctor/Doctor.Service");
const response_1 = require("../Services/response");
const Suvedha_Service_1 = require("../Services/Suvedha/Suvedha.Service");
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profile = yield (0, Suvedha_Service_1.createSuvedhaProfile)(req.body);
        return (0, response_1.successResponse)(profile, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createProfile = createProfile;
const getDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctors = yield (0, Doctor_Service_1.getDoctorsWithAdvancedFilters)(req.query);
        return (0, response_1.successResponse)(doctors, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctors = getDoctors;
const getDoctorInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let doctors = yield (0, Doctor_Service_1.getDoctorById_ForSuvedha)(id);
        console.log(":lhbv dsdds", doctors);
        return (0, response_1.successResponse)(doctors, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorInfo = getDoctorInfo;
