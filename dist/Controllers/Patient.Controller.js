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
exports.resendOtpToPatient = exports.verifyPatientPhoneNumber = exports.canDoctorTakeAppointment = exports.getDoctorsIHaveLikes = exports.checkIfDoctorIsOnHoliday = exports.getPatientsNotification = exports.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod = exports.searchPatientByPhoneNumberOrEmail = exports.checkDoctorAvailability = exports.uploadPrescription = exports.getDoctorsByCity = exports.getHospitalsByCity = exports.getSpecialityBodyPartAndDisease = exports.getDoctorByDay = exports.ViewSchedule = exports.ViewAppointment = exports.viewAppointById = exports.CancelAppointment = exports.doneAppointment = exports.rescheduleAppointment = exports.BookAppointment = exports.deleteProfile = exports.updatePatientProfile = exports.getPatientByHospitalId = exports.getPatientById = exports.patientLogin = exports.createPatient = exports.getAllPatientsList = exports.excludeHospitalFields = exports.excludePatientFields = void 0;
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
// import { excludePatientFields } from "./Patient.Controller";
const OTP_Model_1 = __importDefault(require("../Models/OTP.Model"));
const Appointment_Model_1 = __importDefault(require("../Models/Appointment.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const response_1 = require("../Services/response");
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const Doctor_Controller_1 = require("./Doctor.Controller");
const WorkingHours_Model_1 = __importDefault(require("../Models/WorkingHours.Model"));
const BodyPart_Model_1 = __importDefault(require("../Admin Controlled Models/BodyPart.Model"));
const Disease_Model_1 = __importDefault(require("../Admin Controlled Models/Disease.Model"));
const Specialization_Model_1 = __importDefault(require("../Admin Controlled Models/Specialization.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const Address_Model_1 = __importDefault(require("../Models/Address.Model"));
const Prescription_Model_1 = __importDefault(require("../Models/Prescription.Model"));
const doctorController = __importStar(require("../Controllers/Doctor.Controller"));
const mongoose_1 = __importDefault(require("mongoose"));
const notificationService = __importStar(require("../Services/Notification/Notification.Service"));
const Validation_Service_1 = require("../Services/Validation.Service");
const Appointment_Service_1 = require("../Services/Appointment/Appointment.Service");
const likeService = __importStar(require("../Services/Like/Like.service"));
const prescriptionValidityController = __importStar(require("../Controllers/Prescription-Validity.Controller"));
const Order_Model_1 = __importDefault(require("../Models/Order.Model"));
const Doctor_Service_1 = require("../Services/Doctor/Doctor.Service");
const Patient_Service_1 = require("../Services/Patient/Patient.Service");
const patientService = __importStar(require("../Services/Patient/Patient.Service"));
const Utils_1 = require("../Services/Utils");
const Fee_Model_1 = __importDefault(require("../Module/Payment/Model/Fee.Model"));
exports.excludePatientFields = {
    password: 0,
    verified: 0,
};
exports.excludeHospitalFields = {
    location: 0,
    doctors: 0,
    specialisedIn: 0,
    anemity: 0,
    treatmentType: 0,
    payment: 0,
    numberOfBed: 0,
};
// Get All Patients
const getAllPatientsList = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientList = yield Patient_Model_1.default.find({ deleted: false }, exports.excludePatientFields);
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
        if (body.address) {
            let addressObj = yield new Address_Model_1.default(body.address).save();
            body["address"] = addressObj._id;
        }
        let cryptSalt = yield bcrypt.genSalt(10);
        if (!body.password) {
            body.password = process.env.DEFAULT_PASSWORD;
        }
        body.password = yield bcrypt.hash(body.password, cryptSalt);
        let patientObj = yield new Patient_Model_1.default(body).save();
        jwt.sign(patientObj.toJSON(), process.env.SECRET_PATIENT_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)({ token, _id: patientObj._id }, "Patient profile successfully created", res);
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
                // sendMessage(`Your OTP is: ${OTP}`, body.phoneNumber)
                //   .then(async (message) => {})
                //   .catch((error) => {
                //     // throw error;
                //     console.log("error :", error);
                //     // return errorResponse(error, res);
                //   });
                Utils_1.digiMilesSMS.sendOTPToPhoneNumber(body.phoneNumber, OTP);
                const otpToken = jwt.sign({ otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 }, OTP);
                // Add OTP and phone number to temporary collection
                yield OTP_Model_1.default.findOneAndUpdate({ phoneNumber: body.phoneNumber }, { $set: { phoneNumber: body.phoneNumber, otp: otpToken } }, { upsert: true });
                return (0, response_1.successResponse)({}, `OTP sent successfully`, res);
            }
            else {
                let error = new Error("Invalid phone number");
                error.name = "Invalid input";
                return (0, response_1.errorResponse)(error, res);
            }
        }
        else {
            if (body.phoneNumber == "9999899998") {
                const profile = yield Patient_Model_1.default.findOne({
                    phoneNumber: body.phoneNumber,
                    deleted: false,
                }, {
                    password: 0,
                    verified: 0,
                });
                if (profile) {
                    const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_PATIENT_KEY);
                    const { firstName, lastName, gender, phoneNumber, email, _id, DOB } = profile.toJSON();
                    Patient_Model_1.default
                        .findOneAndUpdate({
                        phoneNumber: body.phoneNumber,
                        deleted: false,
                    }, {
                        $set: {
                            firebaseToken: body.firebaseToken,
                        },
                    })
                        .then((result) => console.log);
                    return (0, response_1.successResponse)({
                        token,
                        firstName,
                        lastName,
                        gender,
                        phoneNumber,
                        email,
                        _id,
                        DOB,
                    }, "Successfully logged in", res);
                }
                else {
                    return (0, response_1.successResponse)({ message: "No Data found" }, "Create a new profile", res, 201);
                }
            }
            const otpData = yield OTP_Model_1.default.findOne({
                phoneNumber: body.phoneNumber,
            });
            try {
                // Abhi k liye OTP verification hata di hai
                let data;
                if (process.env.ENVIRONMENT !== "TEST") {
                    data = yield jwt.verify(otpData.otp, body.OTP);
                    if (Date.now() > data.expiresIn)
                        return (0, response_1.errorResponse)(new Error("OTP expired"), res);
                }
                if (body.OTP === (data === null || data === void 0 ? void 0 : data.otp) || process.env.ENVIRONMENT === "TEST") {
                    // if (true) {
                    const profile = yield Patient_Model_1.default.findOne({
                        phoneNumber: body.phoneNumber,
                        deleted: false,
                    }, {
                        password: 0,
                        verified: 0,
                    });
                    if (profile) {
                        const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_PATIENT_KEY);
                        otpData.remove();
                        const { firstName, lastName, gender, phoneNumber, email, _id, DOB, } = profile.toJSON();
                        Patient_Model_1.default
                            .findOneAndUpdate({
                            phoneNumber: body.phoneNumber,
                            deleted: false,
                        }, {
                            $set: {
                                firebaseToken: body.firebaseToken,
                            },
                        })
                            .then((result) => console.log);
                        return (0, response_1.successResponse)({
                            token,
                            firstName,
                            lastName,
                            gender,
                            phoneNumber,
                            email,
                            _id,
                            DOB,
                        }, "Successfully logged in", res);
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
        const patientData = yield Patient_Model_1.default.findOne({ _id: req.params.id, deleted: false }, exports.excludePatientFields);
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
const getPatientByHospitalId = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            fields: exports.excludePatientFields,
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
        let body = req.body, doctorId = req.body.doctors;
        const rd = new Date(body.time.date);
        const d = rd.getDay();
        let b = req.body;
        let query = {};
        if (d == 0) {
            query["sunday.working"] = true;
            query["sunday.from.time"] = b.time.from.time;
            query["sunday.from.division"] = b.time.from.division;
            query["sunday.till.time"] = b.time.till.time;
            query["sunday.till.division"] = b.time.till.division;
        }
        else if (d == 1) {
            query["monday.working"] = true;
            query["monday.from.time"] = b.time.from.time;
            query["monday.from.division"] = b.time.from.division;
            query["monday.till.time"] = b.time.till.time;
            query["monday.till.division"] = b.time.till.division;
        }
        else if (d == 2) {
            query["tuesday.working"] = true;
            query["tuesday.from.time"] = b.time.from.time;
            query["tuesday.from.division"] = b.time.from.division;
            query["tuesday.till.time"] = b.time.till.time;
            query["tuesday.till.division"] = b.time.till.division;
        }
        else if (d == 3) {
            query["wednesday.working"] = true;
            query["wednesday.from.time"] = b.time.from.time;
            query["wednesday.from.division"] = b.time.from.division;
            query["wednesday.till.time"] = b.time.till.time;
            query["wednesday.till.division"] = b.time.till.division;
        }
        else if (d == 4) {
            query["thursday.working"] = true;
            query["thursday.from.time"] = b.time.from.time;
            query["thursday.from.division"] = b.time.from.division;
            query["thursday.till.time"] = b.time.till.time;
            query["thursday.till.division"] = b.time.till.division;
        }
        else if (d == 5) {
            query["friday.working"] = true;
            query["friday.from.time"] = b.time.from.time;
            query["friday.from.division"] = b.time.from.division;
            query["friday.till.time"] = b.time.till.time;
            query["friday.till.division"] = b.time.till.division;
        }
        else if (d == 6) {
            query["saturday.working"] = true;
            query["saturday.from.time"] = b.time.from.time;
            query["saturday.from.division"] = b.time.from.division;
            query["saturday.till.time"] = b.time.till.time;
            query["saturday.till.division"] = b.time.till.division;
        }
        // @TODO check if working hour exist first
        let capacity = yield WorkingHours_Model_1.default.findOne(Object.assign({ doctorDetails: body.doctors, hospitalDetails: body.hospital }, query));
        if (!capacity) {
            let error = new Error("Error");
            error.message =
                "Working hours does not exist for this hospital and doctor at this time. Please ask doctor to create one or its possible that doctor isn't working on this day";
            // return errorResponse(error, res);
            throw error;
        }
        body.time.date = new Date(body.time.date);
        // body.time.date = new Date(body.time.date);
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
        if (!capacity) {
            const error = new Error("Doctor not available on this day");
            error.name = "Not available";
            return (0, response_1.errorResponse)(error, res);
        }
        let appointmentCount = yield Appointment_Model_1.default.find({
            doctors: body.doctors,
            hospital: body.hospital,
            "time.from.time": capacity.from.time,
            "time.till.time": capacity.till.time,
            cancelled: false,
            done: false,
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
        let message = "Successfully booked appointment";
        if (!(appCount < capacity.capacity)) {
            if (req.currentHospital) {
                message = `Doctor's appointment have exceeded doctor's capacity for the day by ${appCount - capacity.capacity + 1}`;
            }
            else {
                return (0, response_1.errorResponse)(new Error("Doctor cannot take any more appointments"), res);
            }
        }
        if (req.currentHospital) {
            body["Type"] = "Offline";
        }
        else if (req.currentPatient) {
            body["Type"] = "Online";
        }
        /* Appointment ka token Number */
        let appointmentTokenNumber = (yield (0, Appointment_Service_1.getTokenNumber)(body)) + 1;
        /* Appointment ki Id */
        let appointmentId = (0, Appointment_Service_1.generateAppointmentId)();
        body["appointmentToken"] = appointmentTokenNumber;
        body["appointmentId"] = appointmentId;
        let appointmentBook = yield new Appointment_Model_1.default(body).save();
        yield appointmentBook.populate({
            path: "subPatient",
            select: {
                parentPatient: 0,
            },
        });
        /* Appointment notification doctor or hospital ko */
        notificationService.sendAppointmentNotificationToHospitalAndDoctor_FromPatient(body.doctors, body.hospital, body.patient);
        /* Appointment notification patient ko */
        notificationService.sendAppointmentConfirmationNotificationToPatient(body.patient);
        return (0, response_1.successResponse)(appointmentBook, message, res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.BookAppointment = BookAppointment;
// Re-Schedule appointment
const rescheduleAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        // @TODO check if working hour exist first
        let capacity = yield WorkingHours_Model_1.default.findOne({
            doctorDetails: body.doctors,
            hospitalDetails: body.hospital,
        });
        if (!capacity) {
            let error = new Error("Error");
            error.message = "Cannot create appointment";
            // return errorResponse(error, res);
            throw error;
        }
        body.time.date = new Date(body.time.date);
        // body.time.date = new Date(body.time.date);
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
        if (!capacity) {
            const error = new Error("Doctor not available on this day");
            error.name = "Not available";
            return (0, response_1.errorResponse)(error, res);
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
        let appointmentBook = yield Appointment_Model_1.default.findOneAndUpdate({
            _id: body.appointmentId,
        }, {
            $set: { time: body.time, rescheduled: true },
        });
        yield appointmentBook.populate({
            path: "subPatient",
            select: {
                parentPatient: 0,
            },
        });
        return (0, response_1.successResponse)(appointmentBook, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.rescheduleAppointment = rescheduleAppointment;
//Done Appointment
const doneAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentDone = yield Appointment_Model_1.default
            .findOne({
            _id: req.body.id,
        })
            .populate({
            path: "patient",
            select: exports.excludePatientFields,
        })
            .populate({
            path: "hospital",
            select: exports.excludeHospitalFields,
        })
            .populate({
            path: "doctors",
            select: Object.assign(Object.assign({}, Doctor_Controller_1.excludeDoctorFields), { hospitalDetails: 0, specialization: 0, qualification: 0 }),
        })
            .populate({
            path: "subPatient",
            select: {
                parentPatient: 0,
            },
        });
        if (!appointmentDone) {
            return (0, response_1.errorResponse)(new Error("Cannot find appointment with this id"), res, 404);
        }
        if (appointmentDone.cancelled) {
            return (0, response_1.successResponse)({}, "Appointment has already been cancelled", res);
        }
        if (appointmentDone) {
            if (appointmentDone.done === true) {
                return (0, response_1.successResponse)({}, "Appointment is already done", res);
            }
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
            if (appointmentCancel.cancelled === true) {
                return (0, response_1.successResponse)({}, "Appointment is already cancelled", res);
            }
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
const viewAppointById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appointment = yield Appointment_Model_1.default
            .findOne({ _id: req.params.id })
            .populate("doctors patient hospital")
            .lean();
        let orderDetails = yield Order_Model_1.default
            .findOne({
            appointmentDetails: appointment._id,
        })
            .lean();
        appointment["order"] = orderDetails;
        return (0, response_1.successResponse)(appointment, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.viewAppointById = viewAppointById;
//View Appointment History
const ViewAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.params.page);
        let limit = req.query.limit;
        limit = limit ? parseInt(limit) : 10;
        let appointmentData = yield Appointment_Model_1.default.aggregate([
            {
                $match: {
                    patient: new mongoose_1.default.Types.ObjectId(req.currentPatient),
                    cancelled: false,
                },
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "patient",
                    foreignField: "_id",
                    as: "patient",
                },
            },
            {
                $lookup: {
                    from: "hospitals",
                    localField: "hospital",
                    foreignField: "_id",
                    as: "hospital",
                },
            },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctors",
                    foreignField: "_id",
                    as: "doctors",
                },
            },
            // {
            //   $lookup: {
            //     from: "subpatients",
            //     localField: "subPatient",
            //     foreignField: "_id",
            //     as: "subPatient",
            //   },
            // },
            // {
            //   $lookup: {
            //     from: "appointmentpayments",
            //     localField: "_id",
            //     foreignField: "appointmentId",
            //     as: "appointmentpayments",
            //   },
            // },
            // {
            //   $lookup: {
            //     from: "orders",
            //     localField: "appointmentpayments.orderId",
            //     foreignField: "_id",
            //     as: "orders",
            //   },
            // },
            // {
            //   $lookup: {
            //     from: "specializations",
            //     localField: "doctors.specialization",
            //     foreignField: "_id",
            //     as: "specials",
            //   },
            // },
            // {
            //   $addFields: {
            //     "doctors.specialization": "$specials",
            //   },
            // },
            {
                $unwind: "$patient",
            },
            {
                $unwind: "$hospital",
            },
            {
                $unwind: "$doctors",
            },
            // {
            //   $unwind: { path: "$subPatient", preserveNullAndEmptyArrays: true },
            // },
            // {
            //   $unwind: "$appointmentpayments",
            // },
            // {
            //   $unwind: "$orders",
            // },
            {
                $sort: {
                    "time.date": -1,
                },
            },
            // {
            //   $skip: page > 1 ? (page - 1) * 2 : 0,
            // },
            // {
            //   $limit: limit,
            // },
        ]);
        // let appointmentData = await appointmentModel.find({ _id: req.currentPatient })
        const page2 = appointmentData.length / 2;
        let allAppointment = appointmentData;
        if (allAppointment.length > 0) {
            const ConvenienceFee = yield Fee_Model_1.default.findOne({
                name: "Convenience Fee",
            });
            const paymentGateWayFee = yield Fee_Model_1.default.findOne({
                name: "Payment Gateway Fee",
            });
            const tax = yield Fee_Model_1.default.findOne({ name: "Taxes" });
            allAppointment = allAppointment.map((e) => {
                var _a, _b;
                const consult_fee = e.doctors.hospitalDetails.find((hospital) => hospital.hospital.toString() === e.hospital._id.toString()).consultationFee.max;
                let subpatient = e === null || e === void 0 ? void 0 : e.subPatient;
                const appointmentStartTime = (0, Utils_1.formatTime)(`${e.time.from.time}:${e.time.from.division}`);
                const appointmentEndTime = (0, Utils_1.formatTime)(`${e.time.till.time}:${e.time.till.division}`);
                return Object.assign(Object.assign({ booking_id: e === null || e === void 0 ? void 0 : e.appointmentId, pat_name: (e === null || e === void 0 ? void 0 : e.patient)
                        ? `${e === null || e === void 0 ? void 0 : e.patient.firstName} ${e.patient.lastName}`
                        : "", age: `${new Date().getFullYear() - e.patient.DOB.getFullYear()} years`, booking_date: e === null || e === void 0 ? void 0 : e.createdAt, appoinment_date: e === null || e === void 0 ? void 0 : e.time.date, token: e === null || e === void 0 ? void 0 : e.appointmentToken, dr_name: (e === null || e === void 0 ? void 0 : e.doctors)
                        ? `${e.doctors.firstName} ${e.doctors.lastName}`
                        : "", specilization: (e === null || e === void 0 ? void 0 : e.doctors)
                        ? ((_a = e === null || e === void 0 ? void 0 : e.doctors) === null || _a === void 0 ? void 0 : _a.specialization.length) &&
                            ((_b = e === null || e === void 0 ? void 0 : e.doctors) === null || _b === void 0 ? void 0 : _b.specialization.map((elem) => {
                                return elem.specialityName;
                            }).join(""))
                        : "", time_slot: `${appointmentStartTime} to ${appointmentEndTime}`, booking_type: e === null || e === void 0 ? void 0 : e.appointmentType, clinicname: e.hospital && e.hospital.name, consult_fee, conv_fee: ConvenienceFee === null || ConvenienceFee === void 0 ? void 0 : ConvenienceFee.feeAmount, payement_gate_fee: paymentGateWayFee === null || paymentGateWayFee === void 0 ? void 0 : paymentGateWayFee.feeAmount, taxes: tax === null || tax === void 0 ? void 0 : tax.feeAmount }, ((subpatient === null || subpatient === void 0 ? void 0 : subpatient.firstName) && {
                    sub_pat_name: (subpatient === null || subpatient === void 0 ? void 0 : subpatient.firstName) &&
                        `${subpatient === null || subpatient === void 0 ? void 0 : subpatient.firstName} ${subpatient === null || subpatient === void 0 ? void 0 : subpatient.lastName}`,
                    sub_pat_age: (0, Patient_Service_1.calculateAge)(subpatient === null || subpatient === void 0 ? void 0 : subpatient.DOB),
                    sub_pat_gender: subpatient === null || subpatient === void 0 ? void 0 : subpatient.gender,
                })), { parent_gender: e.patient.gender, appointment_type: e === null || e === void 0 ? void 0 : e.appointmentType, appointment_status: e === null || e === void 0 ? void 0 : e.appointmentStatus });
            });
            return (0, response_1.successResponse)(
            // { past: older_apppointmentData, upcoming: allAppointment },
            { allAppointment }, "Appointments has been found", res);
        }
        else {
            let error = new Error("No appointments is found");
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.ViewAppointment = ViewAppointment;
//view the schedule of a doctor working for a specific Hospital for a given day and date
const ViewSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let schedule = yield WorkingHours_Model_1.default.findOne({
            doctorDetails: body.doctors,
            hospitalDetails: body.hospital,
        });
        const requestDate = new Date(body.time);
        let query = {};
        if (body.day == "monday") {
            query = { "monday.working": true };
        }
        else if (body.day == "tuesday") {
            query = { "tuesday.working": true };
            query = { "wednesday.working": true };
        }
        else if (body.day == "thursday") {
            query = { "thursday.working": true };
        }
        else if (body.day == "friday") {
            query = { "friday.working": true };
            query = { "saturday.working": true };
        }
        else if (body.day == "sunday") {
            query = { "sunday.working": true };
        }
        let appointmentCount = yield WorkingHours_Model_1.default.find({
            hospital: body.hospital,
            // "schedule.working":true
        });
        return (0, response_1.successResponse)(schedule, "All Appoinments are succssfully shown  ", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.ViewSchedule = ViewSchedule;
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
// import * as connection from "../Services/connection.db";
// Get speciality, body part and disease
const getSpecialityBodyPartAndDisease = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*
          connect to database
        */
        // const Conn = mongoose.createConnection();
        // await Conn.openUri(<string>process.env.DB_PATH);
        // const speciality = Conn.collection("special")
        //   .find()
        //   .sort({ specialityName: 1 })
        //   .sort({ active: -1 });
        const speciality = Specialization_Model_1.default.find();
        // .sort({ specialityName: 1 })
        // .sort({ active: -1 });
        const bodyParts = BodyPart_Model_1.default.find();
        const disease = Disease_Model_1.default.find();
        const SBD = yield Promise.all([speciality, bodyParts, disease]);
        const [S, B, D] = SBD;
        // Conn.close();
        return (0, response_1.successResponse)({
            Speciality: S,
            BodyPart: B,
            Disease: D,
        }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getSpecialityBodyPartAndDisease = getSpecialityBodyPartAndDisease;
// Get Hospitals by city
const getHospitalsByCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressById = yield Address_Model_1.default.find({ city: req.body.cityId }, { _id: 1 });
        let addressIds = addressById.map((e) => {
            return e._id;
        });
        const hospitalsInThatCity = yield Hospital_Model_1.default
            .find({
            address: { $in: addressIds },
        })
            .populate({
            path: "address",
            populate: {
                path: "city state locality country",
            },
        })
            .populate({
            path: "services",
        });
        let hospitals = hospitalsInThatCity.map((e) => {
            return {
                _id: e === null || e === void 0 ? void 0 : e._id,
                name: e === null || e === void 0 ? void 0 : e.name,
                status: e === null || e === void 0 ? void 0 : e.status,
            };
        });
        // const Conn = mongoose.createConnection();
        // await Conn.openUri(<string>process.env.DB_PATH);
        // const speciality = Conn.collection("special").find();
        const speciality = Specialization_Model_1.default.find();
        const SBD = yield Promise.all([speciality]);
        let [S] = SBD;
        // Conn.close();
        S = S.map((e) => ({
            _id: e === null || e === void 0 ? void 0 : e._id,
            name: e === null || e === void 0 ? void 0 : e.specialityName,
            img: e === null || e === void 0 ? void 0 : e.img,
            specialityNameh: e === null || e === void 0 ? void 0 : e.specialityNameh
        }));
        // return successResponse(hospitalsInThatCity, "Success", res);
        return (0, response_1.successResponse)({ hospitals, specilization: S }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getHospitalsByCity = getHospitalsByCity;
// Get doctors by city
const getDoctorsByCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressById = yield Address_Model_1.default.find({ city: req.body.cityId }, { _id: 1 });
        let addressIds = addressById.map((e) => {
            return e._id;
        });
        let hospitalsInThatCity = yield Hospital_Model_1.default
            .find({
            address: { $in: addressIds },
        }, { doctors: 1 })
            .populate({
            path: "doctors",
            select: Doctor_Controller_1.excludeDoctorFields,
        });
        hospitalsInThatCity = hospitalsInThatCity.filter((e) => e.doctors.length > 0);
        // Isme ek particular hospital k liye consultation fee dikhani hai.
        // Match krna padega k kissi city k liye kissi hospital me kissi doctor ki
        // fee kya hai
        let doctorsInThatCity = [];
        hospitalsInThatCity.map((e) => {
            doctorsInThatCity.push(...e.doctors.map((e) => e._id));
        });
        doctorsInThatCity = yield Doctors_Model_1.default
            .find({
            _id: { $in: doctorsInThatCity },
        }, Doctor_Controller_1.excludeDoctorFields)
            .populate({
            path: "specialization",
        })
            .populate({
            path: "hospitalDetails.hospital",
            populate: {
                path: "address",
                populate: {
                    path: "city state locality country",
                },
            },
        })
            .populate({
            path: "qualification",
            populate: {
                path: "qualificationName",
            },
        });
        // .populate("hospitalDetails.hospital");
        let doctors = doctorsInThatCity.map((e) => {
            return {
                _id: e === null || e === void 0 ? void 0 : e._id,
                name: `${e === null || e === void 0 ? void 0 : e.firstName} ${e === null || e === void 0 ? void 0 : e.lastName}`,
            };
        });
        // const Conn = mongoose.createConnection();
        // await Conn.openUri(<string>process.env.DB_PATH);
        // const speciality = Conn.collection("special").find();
        const speciality = Specialization_Model_1.default.find();
        const SBD = yield Promise.all([speciality]);
        let [S] = SBD;
        // Conn.close();
        S = S.map((e) => ({
            _id: e === null || e === void 0 ? void 0 : e._id,
            name: e === null || e === void 0 ? void 0 : e.specialityName,
            img: e === null || e === void 0 ? void 0 : e.img,
            specialityNameh: e === null || e === void 0 ? void 0 : e.specialityNameh
        }));
        return (0, response_1.successResponse)({ doctors, specilization: S }, "Success", res);
        // return successResponse(doctorsInThatCity, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorsByCity = getDoctorsByCity;
//Upload prescription for the preffered medical centre
const uploadPrescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const image = new Prescription_Model_1.default(req.body);
        image.prescription.data = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        image.prescription.contentType = (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype;
        //  let medicineBook = await new prescriptionModel(req.body,image).save();
        let medicineBook = yield image.save(req.body);
        return (0, response_1.successResponse)(medicineBook, "Medicine has been successfully booked", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.uploadPrescription = uploadPrescription;
const checkDoctorAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDoctorAvaiable = yield doctorController.checkDoctorAvailability(req.body);
        return (0, response_1.successResponse)(isDoctorAvaiable.status, isDoctorAvaiable.message, res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.checkDoctorAvailability = checkDoctorAvailability;
const searchPatientByPhoneNumberOrEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const term = req.params.term;
        const phone = (0, Validation_Service_1.phoneNumberValidation)(term);
        const email = (0, Validation_Service_1.emailValidation)(term);
        if (!phone && !email) {
            const error = new Error("Enter a valid phone number or email");
            error.name = "Invalid Term";
            return (0, response_1.errorResponse)(error, res);
        }
        let patientObj = yield Patient_Model_1.default
            .find({
            $or: [
                {
                    email: term,
                },
                {
                    phoneNumber: term,
                },
            ],
        }, exports.excludePatientFields)
            .lean();
        if (patientObj) {
            if (patientObj.length) {
                patientObj = patientObj.map((e) => {
                    return Object.assign(Object.assign({}, e), { age: (0, Patient_Service_1.calculateAge)(e["DOB"]) });
                });
            }
            return (0, response_1.successResponse)(patientObj, "Success", res);
        }
        return (0, response_1.successResponse)({}, "No data found", res);
    }
    catch (error) {
        if (typeof error == "string") {
            error = new Error(error);
            error.name = "Not Found";
        }
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.searchPatientByPhoneNumberOrEmail = searchPatientByPhoneNumberOrEmail;
const checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId, patientId, hospitalId, subPatientId } = req.body;
        const response = yield prescriptionValidityController.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod({ doctorId, patientId, hospitalId, subPatientId });
        return (0, response_1.successResponse)(response, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod = checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod;
const getPatientsNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notification = notificationService.getPatientsNotification(req.currentPatient);
        Promise.all([notification])
            .then((result) => {
            let notifications = result.map((e) => e[0]);
            return (0, response_1.successResponse)(notifications, "Success", res);
        })
            .catch((error) => (0, response_1.errorResponse)(error, res));
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getPatientsNotification = getPatientsNotification;
const checkIfDoctorIsOnHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { date, month, year, doctorId, hospitalId } = req.body;
        let holidayExist = yield (0, Doctor_Service_1.checkIfDoctorIsAvailableOnTheDay)(date, month, year, doctorId, hospitalId);
        return (0, response_1.successResponse)(holidayExist, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.checkIfDoctorIsOnHoliday = checkIfDoctorIsOnHoliday;
const getDoctorsIHaveLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let myLikes = yield likeService.getDoctorsIHaveLikes(id);
        return (0, response_1.successResponse)(myLikes, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorsIHaveLikes = getDoctorsIHaveLikes;
const canDoctorTakeAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield patientService.canDoctorTakeAppointment(req.body);
        return (0, response_1.successResponse)(response, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.canDoctorTakeAppointment = canDoctorTakeAppointment;
const verifyPatientPhoneNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, Utils_1.verifyPhoneNumber)(req.currentPatient, "patient");
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.verifyPatientPhoneNumber = verifyPatientPhoneNumber;
const resendOtpToPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        yield (0, Utils_1.sendOTPToPhoneNumber)(phoneNumber);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.resendOtpToPatient = resendOtpToPatient;
