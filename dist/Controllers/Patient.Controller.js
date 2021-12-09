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
exports.deleteProfile = exports.updatePatientProfile = exports.getPatientByHospitalId = exports.getPatientById = exports.patientLogin = exports.createPatient = exports.getAllPatientsList = void 0;
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
const OTP_Model_1 = __importDefault(require("../Models/OTP.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const response_1 = require("../Services/response");
// import { sendMessage } from "../Services/message.service";
const message_service_1 = require("../Services/message.service");
const excludePatientFields = {
    password: 0,
    verified: 0,
    DOB: 0,
};
// Get All Patients
const getAllPatientsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientList = yield Patient_Model_1.default.find({ deleted: false }, excludePatientFields);
        return (0, response_1.successResponse)(patientList, "Successfully fetched patient's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllPatientsList = getAllPatientsList;
// Create a new patient account(CREATE)
const createPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let cryptSalt = yield bcrypt.genSalt(10);
        body.password = yield bcrypt.hash(body.password, cryptSalt);
        let patientObj = yield new Patient_Model_1.default(body).save();
        jwt.sign(patientObj.toJSON(), process.env.SECRET_PATIENT_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Patient profile successfully created", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createPatient = createPatient;
// Login as a Patient
const patientLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.query;
        if (!("OTP" in body)) {
            if (/^[0]?[6789]\d{9}$/.test(body.phoneNumber)) {
                const OTP = Math.floor(100000 + Math.random() * 900000).toString();
                // Implement message service API
                (0, message_service_1.sendMessage)(`Your OTP is: ${OTP}`, body.phoneNumber)
                    .then((message) => __awaiter(void 0, void 0, void 0, function* () {
                    const otpToken = jwt.sign({ otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 }, OTP);
                    // Add OTP and phone number to temporary collection
                    yield OTP_Model_1.default.findOneAndUpdate({ phoneNumber: body.phoneNumber }, { $set: { phoneNumber: body.phoneNumber, otp: otpToken } }, { upsert: true });
                }))
                    .catch((error) => {
                    throw error;
                });
                return (0, response_1.successResponse)({}, "OTP sent successfully", res);
            }
            else {
                let error = new Error("Invalid phone number");
                error.name = "Invalid input";
                return (0, response_1.errorResponse)(error, res);
            }
        }
        else {
            const otpData = yield OTP_Model_1.default.findOne({
                phoneNumber: body.phoneNumber,
            });
            try {
                const data = yield jwt.verify(otpData.otp, body.OTP);
                if (Date.now() > data.expiresIn)
                    return (0, response_1.errorResponse)(new Error("OTP expired"), res);
                if (body.OTP === data.otp) {
                    const profile = yield Patient_Model_1.default.findOne({
                        phoneNumber: body.phoneNumber,
                        deleted: false,
                    }, excludePatientFields);
                    if (profile) {
                        const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_PATIENT_KEY);
                        otpData.remove();
                        return (0, response_1.successResponse)(token, "Successfully logged in", res);
                    }
                    else {
                        otpData.remove();
                        return (0, response_1.successResponse)({ message: "No Data found" }, "Create a new profile", res, 201);
                    }
                }
                else {
                    const error = new Error("Invalid OTP");
                    error.name = "Invalid";
                    return (0, response_1.errorResponse)(error, res);
                }
            }
            catch (err) {
                if (err instanceof jwt.JsonWebTokenError) {
                    const error = new Error("OTP isn't valid");
                    error.name = "Invalid OTP";
                    return (0, response_1.errorResponse)(error, res);
                }
                return (0, response_1.errorResponse)(err, res);
            }
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.patientLogin = patientLogin;
// Get Patient By Patient Id(READ)
const getPatientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientData = yield Patient_Model_1.default.findOne({ _id: req.params.id, deleted: false }, excludePatientFields);
        if (patientData) {
            return (0, response_1.successResponse)(patientData, "Successfully fetched patient details", res);
        }
        else {
            const error = new Error("Patient not found");
            error.name = "Not found";
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getPatientById = getPatientById;
// Get patient By Hospital(UPDATE)
const getPatientByHospitalId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getPatientByHospitalId = getPatientByHospitalId;
const updatePatientProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        const updatedPatientObj = yield Patient_Model_1.default.findOneAndUpdate({
            _id: req.currentPatient,
            deleted: false,
        }, {
            $set: body,
        }, {
            fields: excludePatientFields,
            new: true,
        });
        if (updatedPatientObj) {
            return (0, response_1.successResponse)(updatedPatientObj, "Profile updated successfully,", res);
        }
        else {
            let error = new Error("Profile doesn't exist");
            error.name = "Not Found";
            return (0, response_1.errorResponse)(error, res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.updatePatientProfile = updatePatientProfile;
// Delete patient profile(DELETE)
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientProfile = yield Patient_Model_1.default.findOneAndUpdate({ _id: req.currentPatient, deleted: false }, { $set: { deleted: true } });
        if (patientProfile) {
            return (0, response_1.successResponse)({}, "Patient Profile deleted successfully", res);
        }
        else {
            let error = new Error("Patient Profile doesn't exist");
            error.name = "Not found";
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteProfile = deleteProfile;