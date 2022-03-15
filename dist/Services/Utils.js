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
exports.getAge = exports.generateOTPtoken = exports.generateOTP = exports.encryptPassword = exports.phoneNumberRegex = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
exports.phoneNumberRegex = /^[0]?[6789]\d{9}$/;
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cryptSalt = yield bcrypt.genSalt(10);
        let encPassword = yield bcrypt.hash(password, cryptSalt);
        return Promise.resolve(encPassword);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.encryptPassword = encryptPassword;
// export const checkPasswordHas = async (password: string) => {
//   try {
//   } catch (error: any) {
//     return Promise.reject(error);
//   }
// };
const generateOTP = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    if (exports.phoneNumberRegex.test(phoneNumber)) {
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("jdfjnjndf", OTP);
        return Promise.resolve(OTP);
    }
    else {
        return Promise.reject("Invalid Phone Number");
    }
});
exports.generateOTP = generateOTP;
const generateOTPtoken = (OTP) => {
    const otpToken = jwt.sign({ otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 }, OTP);
    return otpToken;
};
exports.generateOTPtoken = generateOTPtoken;
const getAge = (dob) => {
    const exp = (0, moment_1.default)(new Date(dob));
    const currentDate = (0, moment_1.default)(new Date());
    let age = currentDate.diff(exp, "years", true);
    if (age < 1) {
        age = currentDate.diff(exp, "months");
    }
    return age;
};
exports.getAge = getAge;
