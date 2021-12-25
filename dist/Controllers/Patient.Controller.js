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
exports.verifyPayment = exports.generateOrderId = exports.getDoctorByDay = exports.CancelAppointment = exports.doneAppointment = exports.BookAppointment = exports.deleteProfile = exports.updatePatientProfile = exports.getPatientByHospitalId = exports.getPatientById = exports.patientLogin = exports.createPatient = exports.getAllPatientsList = void 0;
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
const OTP_Model_1 = __importDefault(require("../Models/OTP.Model"));
const Appointment_Model_1 = __importDefault(require("../Models/Appointment.Model"));
const AppointmentPayment_Model_1 = __importDefault(require("../Models/AppointmentPayment.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const response_1 = require("../Services/response");
// import { sendMessage } from "../Services/message.service";
const message_service_1 = require("../Services/message.service");
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const Doctor_Controller_1 = require("./Doctor.Controller");
const WorkingHours_Model_1 = __importDefault(require("../Models/WorkingHours.Model"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
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
//Book an apponitment
const BookAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let capacity = yield WorkingHours_Model_1.default.findOne({
            doctorDetails: body.doctors,
            hospitalDetails: body.hospital,
        });
        const requestDate = new Date(body.time.date);
        const day = requestDate.getDay();
        if (day == 0) {
            capacity = capacity.sunday;
        }
        else if (day == 1) {
            capacity = capacity.monday;
        }
        else if (day == 2) {
            capacity = capacity.tuesday;
        }
        else if (day == 3) {
            capacity = capacity.wednesday;
        }
        else if (day == 4) {
            capacity = capacity.thursday;
        }
        else if (day == 5) {
            capacity = capacity.friday;
        }
        else if (day == 6) {
            capacity = capacity.saturday;
        }
        let appointmentCount = yield Appointment_Model_1.default.find({
            doctors: body.doctors,
            hospital: body.hospital,
            "time.from.time": capacity.from.time,
            "time.till.time": capacity.till.time,
        });
        let appCount = 0;
        appointmentCount = appointmentCount.map((e) => {
            if (new Date(e.time.date).getDate() == new Date(requestDate).getDate() &&
                new Date(e.time.date).getFullYear() ==
                    new Date(requestDate).getFullYear() &&
                new Date(e.time.date).getMonth() == new Date(requestDate).getMonth()) {
                appCount++;
            }
        });
        if (appCount == capacity.capacity) {
            return (0, response_1.errorResponse)(new Error("Doctor cannot take any more appointments"), res);
        }
        let appointmentBook = yield new Appointment_Model_1.default(body).save();
        return (0, response_1.successResponse)(appointmentBook, "Appoinment has been successfully booked", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.BookAppointment = BookAppointment;
//Done Appointment
const doneAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentDone = yield Appointment_Model_1.default.findOne({
            _id: req.body.id,
        });
        if (appointmentDone.cancelled) {
            return (0, response_1.successResponse)({}, "Appointment has already been cancelled", res);
        }
        if (appointmentDone) {
            appointmentDone.done = true;
            yield appointmentDone.save();
            return (0, response_1.successResponse)({}, "Appointment done successfully", res);
        }
        else {
            let error = new Error("Appointment already done.");
            error.name = "Not found";
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.doneAppointment = doneAppointment;
//Cancel appoinment
const CancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentCancel = yield Appointment_Model_1.default.findOne({ _id: req.body.id }
        //  { $set: { cancelled: true } }
        );
        if (appointmentCancel.done) {
            return (0, response_1.successResponse)({}, "Appointment has already done", res);
        }
        if (appointmentCancel) {
            appointmentCancel.cancelled = true;
            yield appointmentCancel.save();
            return (0, response_1.successResponse)({}, "Appoinment cancelled successfully", res);
        }
        else {
            let error = new Error(" This Appoinement doesn't exist");
            error.name = "Not found";
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.CancelAppointment = CancelAppointment;
// Get doctor list
const getDoctorByDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const day = `${body.day}.working`;
        let query = {};
        if (body.day == "monday") {
            query = { "monday.working": true };
        }
        else if (body.day == "tuesday") {
            query = { "tuesday.working": true };
        }
        else if (body.day == "wednesday") {
            query = { "wednesday.working": true };
        }
        else if (body.day == "thursday") {
            query = { "thursday.working": true };
        }
        else if (body.day == "friday") {
            query = { "friday.working": true };
        }
        else if (body.day == "saturday") {
            query = { "saturday.working": true };
        }
        else if (body.day == "sunday") {
            query = { "sunday.working": true };
        }
        const data = yield WorkingHours_Model_1.default
            .find(query, "doctorDetails")
            .distinct("doctorDetails");
        const doctorData = yield Doctors_Model_1.default.find({ _id: { $in: data } }, Doctor_Controller_1.excludeDoctorFields);
        return (0, response_1.successResponse)(doctorData, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorByDay = getDoctorByDay;
const generateOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let instance = new razorpay_1.default({
            key_id: process.env.RAZOR_PAY_TEST_ID,
            key_secret: process.env.RAZOR_PAY_TEST_SECRET,
        });
        const receiptNumber = Math.floor(100000 + Math.random() * 900000).toString();
        var options = {
            amount: body.amount,
            currency: body.currency,
            receipt: `order_rcptid_${receiptNumber}`,
        };
        instance.orders.create(options, function (err, order) {
            // console.log(order);
            if (err) {
                return (0, response_1.errorResponse)(err, res);
            }
            return (0, response_1.successResponse)({ orderId: order.id }, "Order id generated", res);
        });
    }
    catch (e) {
        return (0, response_1.errorResponse)(e, res);
    }
});
exports.generateOrderId = generateOrderId;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body.response.razorpay_order_id +
            "|" +
            req.body.response.razorpay_payment_id;
        var expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZOR_PAY_TEST_SECRET)
            .update(body.toString())
            .digest("hex");
        var response = { signatureIsValid: "false" };
        if (expectedSignature === req.body.response.razorpay_signature) {
            response = { signatureIsValid: "true" };
            const paymentObj = yield new AppointmentPayment_Model_1.default(req.body);
            response.paymentDetails = paymentObj;
            return (0, response_1.successResponse)(response, "Signature is valid", res);
        }
        let error = new Error("Signature is invalid");
        error.name = "INvalid signature";
        return (0, response_1.errorResponse)(error, res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.verifyPayment = verifyPayment;
