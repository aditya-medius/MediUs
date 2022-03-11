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
exports.getAgentToken = exports.verifyOtpAndLogin = exports.sendOTP = exports.login = exports.createAgentProfile = void 0;
const Agent_Model_1 = __importDefault(require("../../Models/Agent.Model"));
const Utils_1 = require("../Utils");
const dotenv = __importStar(require("dotenv"));
const message_service_1 = require("../message.service");
const OTP_Model_1 = __importDefault(require("../../Models/OTP.Model"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv.config();
const createAgentProfile = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // if (body.password) {
        //   body.password = await encryptPassword(body.password);
        // } else {
        //   body.password = await encryptPassword(
        //     process.env.DEFAULT_PASSWORD as string
        //   );
        // }
        const agentData = yield new Agent_Model_1.default(body).save();
        return Promise.resolve(agentData);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createAgentProfile = createAgentProfile;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!("OTP" in body)) {
            const OTP = yield (0, exports.sendOTP)(body.phoneNumber);
            return Promise.resolve({
                data: OTP,
                message: "OTP sent successfully",
            });
        }
        else {
            return Promise.resolve({
                data: yield (0, exports.verifyOtpAndLogin)(body),
                message: "Successfully logged in",
            });
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.login = login;
const sendOTP = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (/^[0]?[6789]\d{9}$/.test(phoneNumber)) {
            const OTP = yield (0, Utils_1.generateOTP)(phoneNumber);
            (0, message_service_1.sendMessage)(`Your OTP is: ${OTP}`, phoneNumber)
                .then((message) => __awaiter(void 0, void 0, void 0, function* () {
                // Add OTP and phone number to temporary collection
                const otpToken = (0, Utils_1.generateOTPtoken)(OTP);
                yield OTP_Model_1.default.findOneAndUpdate({ phoneNumber: phoneNumber }, { $set: { phoneNumber: phoneNumber, otp: otpToken } }, { upsert: true });
            }))
                .catch((error) => {
                return Promise.reject(error);
            });
            return Promise.resolve({});
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.sendOTP = sendOTP;
const verifyOtpAndLogin = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otpData = yield OTP_Model_1.default.findOne({
            phoneNumber: body.phoneNumber,
        });
        const data = yield jwt.verify(otpData.otp, body.OTP);
        if (Date.now() > data.expiresIn)
            return Promise.reject(new Error("OTP Expired"));
        if (body.OTP === data.otp) {
            otpData.remove();
            let profile = yield Agent_Model_1.default.findOne({
                phoneNumber: body.phoneNumber,
                "delData.delData": false,
            }, {
                location: 0,
                password: 0,
                delData: 0,
            });
            const token = yield (0, exports.getAgentToken)(profile.toJSON());
            return Promise.resolve(Object.assign({ token }, profile.toJSON()));
        }
    }
    catch (error) {
        return Promise.reject(new Error("Invalid OTP"));
    }
});
exports.verifyOtpAndLogin = verifyOtpAndLogin;
const getAgentToken = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwt.sign(body, process.env.SECRET_AGENT_KEY);
    return token;
});
exports.getAgentToken = getAgentToken;
