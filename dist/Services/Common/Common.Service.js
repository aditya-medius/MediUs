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
exports.setProfileImage = void 0;
const Doctors_Model_1 = __importDefault(require("../../Models/Doctors.Model"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
const Patient_Model_1 = __importDefault(require("../../Models/Patient.Model"));
const setProfileImage = (id, profileImageUrl, uploadfor) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userModel, upateQuery;
        switch (uploadfor) {
            case "doctor": {
                userModel = Doctors_Model_1.default;
                upateQuery = { $set: { profileImage: profileImageUrl } };
                break;
            }
            case "hospital": {
                userModel = Hospital_Model_1.default;
                upateQuery = { $set: { profileImage: profileImageUrl } };
                break;
            }
            case "patient": {
                userModel = Patient_Model_1.default;
                upateQuery = { $set: { profileImage: profileImageUrl } };
                break;
            }
        }
        yield (userModel === null || userModel === void 0 ? void 0 : userModel.findOneAndUpdate({ _id: id }, upateQuery));
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.setProfileImage = setProfileImage;
