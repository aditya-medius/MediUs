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
exports.getAllFees = exports.setFee = void 0;
const Fee_Model_1 = __importDefault(require("../Model/Fee.Model"));
const setFee = (name, feeAmount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let feeData = yield new Fee_Model_1.default({
            name,
            feeAmount,
        }).save();
        return Promise.resolve(feeData);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.setFee = setFee;
const getAllFees = (query = {}) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let feeData = yield Fee_Model_1.default.find(query);
        return Promise.resolve(feeData);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getAllFees = getAllFees;
