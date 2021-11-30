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
exports.getDoctorByHospitalId = exports.getDoctorById = exports.doctorLogin = exports.createDoctor = exports.getAllDoctorsList = void 0;
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const response_1 = require("../Services/response");
const excludeDoctorFields = {
    password: 0,
    panCard: 0,
    adhaarCard: 0,
    verified: 0,
    registrationDate: 0,
    DOB: 0,
};
// Get All Doctors
const getAllDoctorsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorList = yield Doctors_Model_1.default.find({}, excludeDoctorFields);
        return (0, response_1.successResponse)(doctorList, "Successfully fetched doctor's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllDoctorsList = getAllDoctorsList;
// Create a new doctor account
const createDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let cryptSalt = yield bcrypt.genSalt(10);
        body.password = yield bcrypt.hash(body.password, cryptSalt);
        let doctorObj = yield new Doctors_Model_1.default(body).save();
        jwt.sign(doctorObj.toJSON(), process.env.SECRET_DOCTOR_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Doctor profile successfully created", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createDoctor = createDoctor;
// Login as Doctor
const doctorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorDetail = yield Doctors_Model_1.default.findOne({
            email: req.body.email,
        });
        if (doctorDetail) {
            try {
                const encryptResult = yield bcrypt.compare(req.body.password, doctorDetail.password);
                if (encryptResult) {
                    const token = yield jwt.sign(doctorDetail.toJSON(), process.env.SECRET_DOCTOR_KEY);
                    return (0, response_1.successResponse)(token, "Successfully logged in", res);
                }
                else {
                    const error = new Error("Invalid Password");
                    error.name = "Authentication Error";
                    return (0, response_1.errorResponse)(error, res);
                }
            }
            catch (error) {
                return (0, response_1.errorResponse)(error, res, 401);
            }
        }
        else {
            const error = new Error("Invalid Email");
            error.name = "Authentication Error";
            return (0, response_1.errorResponse)(error, res, 401);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.doctorLogin = doctorLogin;
// Get Doctor By Doctor Id
const getDoctorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorData = yield Doctors_Model_1.default.findOne({ _id: req.params.id }, excludeDoctorFields);
        if (doctorData) {
            return (0, response_1.successResponse)(doctorData, "Successfully fetched doctor details", res);
        }
        else {
            const error = new Error("Doctor not found");
            error.name = "Not found";
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorById = getDoctorById;
// Get Doctor By Hospital
const getDoctorByHospitalId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorByHospitalId = getDoctorByHospitalId;
