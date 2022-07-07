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
exports.deleteQualification = exports.addQualificationName = exports.getQualificationList = exports.addDoctorQualification = void 0;
const Qualification_Model_1 = __importDefault(require("../Models/Qualification.Model"));
const QualificationName_Model_1 = __importDefault(require("../Admin Controlled Models/QualificationName.Model"));
const response_1 = require("../Services/response");
const addDoctorQualification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        const qualificationDoc = yield new Qualification_Model_1.default(body).save();
        yield qualificationDoc.populate("qualificationName");
        return (0, response_1.successResponse)(qualificationDoc, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addDoctorQualification = addDoctorQualification;
const getQualificationList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, response_1.successResponse)(yield QualificationName_Model_1.default.find({ "del.deleted": false }), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getQualificationList = getQualificationList;
const addQualificationName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        return (0, response_1.successResponse)(yield new QualificationName_Model_1.default(body).save(), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addQualificationName = addQualificationName;
const deleteQualification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, response_1.successResponse)(yield QualificationName_Model_1.default.findOneAndDelete({ _id: req.params.id }), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteQualification = deleteQualification;
