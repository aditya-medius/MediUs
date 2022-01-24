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
exports.updateKyc = exports.addKYC = void 0;
const KYC_Model_1 = __importDefault(require("../Models/KYC.Model"));
const response_1 = require("../Services/response");
const addKYC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        const kycObj = yield new KYC_Model_1.default(body).save();
        return (0, response_1.successResponse)(kycObj, "Successfully created KYC", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addKYC = addKYC;
const updateKyc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        const kycObj = yield KYC_Model_1.default.findOneAndUpdate({
            _id: body.id,
        }, {
            $set: body,
        }, { new: true });
        return (0, response_1.successResponse)(kycObj, "Successfully updated KYC details", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.updateKyc = updateKyc;
