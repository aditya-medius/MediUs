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
exports.updateHospitalById = exports.getHospitalDetailsById = void 0;
const Hospital_Model_1 = __importDefault(require("../../../Models/Hospital.Model"));
const Hospital_Util_1 = require("../Hospital.Util");
const getHospitalDetailsById = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    const hospital = yield Hospital_Model_1.default.findOne({ _id: hospitalId });
    return (0, Hospital_Util_1.formatHospital)(hospital);
});
exports.getHospitalDetailsById = getHospitalDetailsById;
const updateHospitalById = (hospitalId, updateQuery) => __awaiter(void 0, void 0, void 0, function* () {
    yield Hospital_Model_1.default.findOneAndUpdate({ _id: hospitalId }, updateQuery);
    return Promise.resolve(true);
});
exports.updateHospitalById = updateHospitalById;
