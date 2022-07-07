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
exports.deleteOwnership = exports.getOwnership = exports.addOwnership = void 0;
const Ownership_Model_1 = __importDefault(require("../../Models/Ownership.Model"));
const addOwnership = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield new Ownership_Model_1.default(body).save());
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.addOwnership = addOwnership;
const getOwnership = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield Ownership_Model_1.default.find());
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getOwnership = getOwnership;
const deleteOwnership = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield Ownership_Model_1.default.findOneAndDelete({ _id: id }));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.deleteOwnership = deleteOwnership;
