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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteThatDoctorTakesOverTheCounterPayments = exports.setThatDoctorTakesOverTheCounterPayments = exports.getDoctorsAllHolidayList = exports.getDoctorQualificationList = exports.deleteDoctorQualification = exports.verifyOTPToUpdateNumber = exports.sendOTPToUpdateNumber = exports.getSpecializationByCity = exports.getMyLikes = exports.unlikeDoctor = exports.likeADoctor = exports.getPrescriptionValidityAndFeesOfDoctorInHospital = exports.getAppointmentFeeFromAppointmentId = exports.getListOfAllAppointments = exports.getHospitalsOfflineAndOnlineAppointments = exports.deleteHolidayCalendar = exports.getDoctorsHolidayList = exports.setHolidayCalendar = exports.getDoctorsNotification = exports.getDoctorsOfflineAndOnlineAppointments = exports.getListOfRequestedApprovals_ByDoctor = exports.getListOfRequestedApprovals_OfDoctor = exports.setConsultationFeeForDoctor = exports.addHospitalInDoctorProfile = exports.checkVerificationStatus = exports.updateQualification = exports.deleteHospitalFromDoctor = exports.deleteSpecializationAndQualification = exports.getAppointmentSummary = exports.withdraw = exports.getPendingAmount = exports.getAvailableAmount = exports.getTotalEarnings = exports.checkDoctorAvailability = exports.getHospitalListByDoctorId = exports.searchDoctorByPhoneNumberOrEmail = exports.getDoctorWorkingInHospitals = exports.cancelAppointments = exports.viewAppointmentsByDate = exports.viewAppointments = exports.setSchedule = exports.searchDoctor = exports.deleteProfile = exports.updateDoctorProfile = exports.getDoctorByHospitalId = exports.getDoctorById = exports.doctorLogin = exports.createDoctor = exports.getAllDoctorsList = exports.excludeDoctorFields = void 0;
exports.resendOtpToDoctor = exports.getDoctorsAdvancedBookingPeriod = exports.deleteDoctorsAdvancedBookingPeriod = exports.setDoctorsAdvancedBookingPeriod = exports.checkIfDoctorTakesOverTheCounterPaymentsForAHospital = void 0;
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const OTP_Model_1 = __importDefault(require("../Models/OTP.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const response_1 = require("../Services/response");
const SpecialityBody_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityBody.Model"));
const Specialization_Model_1 = __importDefault(require("../Admin Controlled Models/Specialization.Model"));
const underscore_1 = __importDefault(require("underscore"));
const SpecialityDisease_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityDisease.Model"));
const schemaNames_1 = require("../Services/schemaNames");
const SpecialityDoctorType_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityDoctorType.Model"));
const WorkingHours_Model_1 = __importDefault(require("../Models/WorkingHours.Model"));
const mongoose_1 = __importDefault(require("mongoose"));
const Appointment_Model_1 = __importDefault(require("../Models/Appointment.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const Validation_Service_1 = require("../Services/Validation.Service");
const doctorService = __importStar(require("../Services/Doctor/Doctor.Service"));
const Withdrawal_Model_1 = __importDefault(require("../Models/Withdrawal.Model"));
const Qualification_Model_1 = __importDefault(require("../Models/Qualification.Model"));
const Patient_Service_1 = require("../Services/Patient/Patient.Service");
const approvalService = __importStar(require("../Services/Approval-Request/Approval-Request.Service"));
const holidayService = __importStar(require("../Services/Holiday-Calendar/Holiday-Calendar.Service"));
const hospitalService = __importStar(require("../Services/Hospital/Hospital.Service"));
const prescriptionController = __importStar(require("../Controllers/Prescription-Validity.Controller"));
exports.excludeDoctorFields = {
    password: 0,
    // panCard: 0,
    // adhaarCard: 0,
    // verified: 0,
    registrationDate: 0,
    DOB: 0,
    registration: 0,
    KYCDetails: 0,
};
// Get All Doctors
const getAllDoctorsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorList = yield Doctors_Model_1.default.find({ deleted: false }, exports.excludeDoctorFields);
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
        if (body.password) {
            let cryptSalt = yield bcrypt.genSalt(10);
            body.password = yield bcrypt.hash(body.password, cryptSalt);
        }
        let doctorObj = yield new Doctors_Model_1.default(body).save();
        if (body === null || body === void 0 ? void 0 : body.specialization) {
            Specialization_Model_1.default
                .updateMany({ _id: { $in: body === null || body === void 0 ? void 0 : body.specialization } }, { $set: { active: true } })
                .then();
        }
        yield doctorObj.populate("qualification");
        doctorObj = doctorObj.toObject();
        doctorObj.qualification = doctorObj.qualification[0];
        jwt.sign(doctorObj, process.env.SECRET_DOCTOR_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            const { firstName, lastName, gender, phoneNumber, _id, qualification, verified, } = doctorObj;
            return (0, response_1.successResponse)({
                token,
                firstName,
                lastName,
                gender,
                phoneNumber,
                _id,
                qualification,
                verified,
            }, "Doctor profile successfully created", res);
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
        let body = req.query;
        if (!("OTP" in body)) {
            if (/^[0]?[6789]\d{9}$/.test(body.phoneNumber)) {
                const OTP = Math.floor(100000 + Math.random() * 900000).toString();
                if (!(body.phoneNumber == "9999799997")) {
                    // sendMessage(`Your OTP is: ${OTP}`, body.phoneNumber)
                    //   .then(async (message) => {})
                    //   .catch((error) => {
                    //     throw error;
                    //   });
                    Utils_1.digiMilesSMS.sendOTPToPhoneNumber(body.phoneNumber, OTP);
                    const otpToken = jwt.sign({ otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 }, OTP);
                    // Add OTP and phone number to temporary collection
                    yield OTP_Model_1.default.findOneAndUpdate({ phoneNumber: body.phoneNumber }, { $set: { phoneNumber: body.phoneNumber, otp: otpToken } }, { upsert: true });
                    return (0, response_1.successResponse)({}, "OTP sent successfully", res);
                }
                else {
                    return (0, response_1.successResponse)({}, "OTP sent successfully", res);
                }
                // Implement message service API
            }
            else {
                let error = new Error("Invalid phone number");
                error.name = "Invalid input";
                return (0, response_1.errorResponse)(error, res);
            }
        }
        else {
            if (body.phoneNumber == "9999999999") {
                const profile = yield Doctors_Model_1.default
                    .findOne({
                    phoneNumber: body.phoneNumber,
                    deleted: false,
                }, exports.excludeDoctorFields)
                    .populate("qualification");
                if (profile) {
                    const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_DOCTOR_KEY);
                    let { firstName, lastName, gender, phoneNumber, email, _id, qualification, preBookingTime, phoneNumberVerified, image } = profile.toJSON();
                    qualification = qualification[0];
                    return (0, response_1.successResponse)({
                        token,
                        firstName,
                        lastName,
                        gender,
                        phoneNumber,
                        email,
                        _id,
                        qualification,
                        preBookingTime,
                        phoneNumberVerified,
                        profileImage: image
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
                let data;
                // Abhi k liye OTP verification hata di hai
                // if (
                //   process.env.ENVIRONMENT !== "TEST" ||
                // )
                if (!["TEST", "PROD"].includes(process.env.ENVIRONMENT)) {
                    data = yield jwt.verify(otpData.otp, body.OTP);
                    if (Date.now() > data.expiresIn)
                        return (0, response_1.errorResponse)(new Error("OTP expired"), res);
                }
                if (body.OTP === (data === null || data === void 0 ? void 0 : data.otp) ||
                    ["TEST", "PROD"].includes(process.env.ENVIRONMENT)) {
                    let profile = yield Doctors_Model_1.default.findOne({
                        phoneNumber: body.phoneNumber,
                        deleted: false,
                        login: true,
                    }, {
                        password: 0,
                        // panCard: 0,
                        // adhaarCard: 0,
                        registrationDate: 0,
                        DOB: 0,
                        registration: 0,
                        KYCDetails: 0,
                    });
                    if (profile) {
                        if (Object.keys(profile.toObject()).includes("verified") &&
                            !profile.verified) {
                            return (0, response_1.errorResponse)(new Error("Your profile is under verification"), res, 202);
                        }
                        const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_DOCTOR_KEY);
                        otpData.remove();
                        yield profile.populate("qualification");
                        profile = profile.toObject();
                        profile.qualification = profile.qualification[0];
                        const { firstName, lastName, gender, phoneNumber, email, _id, qualification, verified, preBookingTime, phoneNumberVerified, image } = profile;
                        Doctors_Model_1.default
                            .findOneAndUpdate({
                            phoneNumber: body.phoneNumber,
                            deleted: false,
                        }, {
                            $set: {
                                firebaseToken: body.firebaseToken,
                            },
                        })
                            .then((result) => console.log("jhdsdsdsd", result));
                        return (0, response_1.successResponse)({
                            token,
                            firstName,
                            lastName,
                            gender,
                            phoneNumber,
                            email,
                            _id,
                            qualification,
                            verified,
                            preBookingTime,
                            phoneNumberVerified,
                            profileImage: image
                        }, "Successfully logged in", res);
                    }
                    else {
                        otpData.remove();
                        Doctors_Model_1.default.findOneAndUpdate({
                            phoneNumber: body.phoneNumber,
                            deleted: false,
                        }, {
                            firebaseToken: body.firebaseToken,
                        });
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
exports.doctorLogin = doctorLogin;
// Get Doctor By Doctor Id
const getDoctorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {
            _id: req.params.id,
            deleted: false,
            excludeDoctorFields: exports.excludeDoctorFields,
        };
        let select = Object.assign({}, exports.excludeDoctorFields);
        if (req.body.fullDetails) {
            query = { _id: req.params.id, deleted: false };
            select = { password: 0 };
        }
        const doctorData = yield Doctors_Model_1.default
            .findOne(query, select)
            .populate({
            path: "hospitalDetails.hospital",
            populate: {
                path: "address",
                populate: {
                    path: "city state locality country",
                },
            },
        })
            .populate("hospitalDetails.workingHours")
            .populate("specialization")
            .populate({
            path: "qualification",
            populate: {
                path: "qualificationName",
            },
        })
            .lean();
        console.log(":ldsvdsdsds", doctorData);
        if (doctorData) {
            doctorData.hospitalDetails = doctorData.hospitalDetails.map((elem) => {
                return {
                    _id: elem.hospital._id,
                    name: elem.hospital.name,
                    address: elem.hospital.address,
                };
            });
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
const updateDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _a = req.body, { hospitalDetails, specialization, qualification } = _a, body = __rest(_a, ["hospitalDetails", "specialization", "qualification"]);
        const updateQuery = {
            $set: body,
            // $addToSet: { hospitalDetails, specialization, qualification },
        };
        const updatedDoctorObj = yield Doctors_Model_1.default.findOneAndUpdate({
            _id: req.currentDoctor,
            deleted: false,
        }, updateQuery, {
            fields: exports.excludeDoctorFields,
            new: true,
        });
        if (updatedDoctorObj) {
            return (0, response_1.successResponse)(updatedDoctorObj, "Profile updated successfully,", res);
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
exports.updateDoctorProfile = updateDoctorProfile;
/*
  Agar yeh doctor kissi hospital array me hai
  to isko waha se hatane k zaroorat nhi, uski vjhaye
  jab uss hospital k doctors ko GET kre to ek filter lagaye jisse
  k soft deleted doctors return na ho.
*/
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let deleteDate = new Date();
        const doctorProfile = yield Doctors_Model_1.default.findOneAndUpdate({ _id: req.currentDoctor, deleted: false }, { $set: { deleted: true, deleteDate } });
        if (doctorProfile) {
            return (0, response_1.successResponse)({}, "Profile deleted successfully", res);
        }
        else {
            let error = new Error("Profile doesn't exist");
            error.name = "Not found";
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteProfile = deleteProfile;
// Get doctor by speciality or body parts
const searchDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const term = req.params.term;
        let { city, gender } = req.query;
        let matchQuery = {};
        const promiseArray = [
            SpecialityBody_Model_1.default.aggregate([
                {
                    $facet: {
                        bySpeciality: [
                            {
                                $lookup: {
                                    from: "specializations",
                                    localField: "speciality",
                                    foreignField: "_id",
                                    as: "byspeciality",
                                },
                            },
                            {
                                $match: {
                                    "byspeciality.specialityName": {
                                        $regex: term,
                                        $options: "i",
                                    },
                                },
                            },
                            {
                                $project: {
                                    speciality: 1,
                                    _id: 0,
                                },
                            },
                        ],
                        byBodyPart: [
                            {
                                $lookup: {
                                    from: "bodyparts",
                                    localField: "bodyParts",
                                    foreignField: "_id",
                                    as: "bodyPart",
                                },
                            },
                            {
                                $match: {
                                    "bodyPart.bodyPart": { $regex: term, $options: "i" },
                                },
                            },
                            {
                                $project: {
                                    speciality: 1,
                                    _id: 0,
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        BodyAndSpeciality: {
                            $setUnion: ["$bySpeciality", "$byBodyPart"],
                        },
                    },
                },
                { $unwind: "$BodyAndSpeciality" },
                { $replaceRoot: { newRoot: "$BodyAndSpeciality" } },
            ]),
            SpecialityDisease_Model_1.default.aggregate([
                {
                    $facet: {
                        bySpeciality: [
                            {
                                $lookup: {
                                    from: schemaNames_1.specialization,
                                    localField: "speciality",
                                    foreignField: "_id",
                                    as: "byspeciality",
                                },
                            },
                            {
                                $match: {
                                    "byspeciality.specialityName": {
                                        $regex: term,
                                        $options: "i",
                                    },
                                },
                            },
                            {
                                $project: {
                                    speciality: 1,
                                    _id: 0,
                                },
                            },
                        ],
                        byDisease: [
                            {
                                $lookup: {
                                    from: schemaNames_1.disease,
                                    localField: "disease",
                                    foreignField: "_id",
                                    as: "disease",
                                },
                            },
                            {
                                $match: {
                                    "disease.disease": { $regex: term, $options: "i" },
                                },
                            },
                            {
                                $project: {
                                    speciality: 1,
                                    _id: 0,
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        DiseaseAndSpeciality: {
                            $setUnion: ["$bySpeciality", "$byDisease"],
                        },
                    },
                },
                { $unwind: "$DiseaseAndSpeciality" },
                { $replaceRoot: { newRoot: "$DiseaseAndSpeciality" } },
            ]),
            SpecialityDoctorType_Model_1.default.aggregate([
                {
                    $facet: {
                        bySpeciality: [
                            {
                                $lookup: {
                                    from: schemaNames_1.specialization,
                                    localField: "speciality",
                                    foreignField: "_id",
                                    as: "byspeciality",
                                },
                            },
                            {
                                $match: {
                                    "byspeciality.specialityName": {
                                        $regex: term,
                                        $options: "i",
                                    },
                                },
                            },
                            {
                                $project: {
                                    speciality: 1,
                                    _id: 0,
                                },
                            },
                        ],
                        byDoctorType: [
                            {
                                $lookup: {
                                    from: schemaNames_1.doctorType,
                                    localField: "doctorType",
                                    foreignField: "_id",
                                    as: "doctorType",
                                },
                            },
                            {
                                $match: {
                                    "doctorType.doctorType": { $regex: term, $options: "i" },
                                },
                            },
                            {
                                $project: {
                                    speciality: 1,
                                    _id: 0,
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        DoctorTypeAndSpeciality: {
                            $setUnion: ["$bySpeciality", "$byDoctorType"],
                        },
                    },
                },
                { $unwind: "$DoctorTypeAndSpeciality" },
                { $replaceRoot: { newRoot: "$DoctorTypeAndSpeciality" } },
            ]),
            Doctors_Model_1.default.aggregate([
                {
                    $match: {
                        $or: [
                            { firstName: { $regex: term, $options: "i" } },
                            { lastName: { $regex: term, $options: "i" } },
                        ],
                    },
                },
                {
                    $project: {
                        // specialization: 1,
                        _id: 1,
                    },
                },
                { $unwind: "$_id" },
            ]),
            Specialization_Model_1.default.aggregate([
                {
                    $match: {
                        specialityName: { $regex: term, $options: "i" },
                    },
                },
                {
                    $project: {
                        _id: 1,
                    },
                },
            ]),
        ];
        Promise.all(promiseArray)
            .then((specialityArray) => __awaiter(void 0, void 0, void 0, function* () {
            let formatArray = (arr) => {
                arr = arr.flat();
                return underscore_1.default.map(arr, (e) => e.speciality ? e.speciality.toString() : e._id.toString());
            };
            let SA = Object.assign([], specialityArray);
            let id = specialityArray.splice(-1, 1);
            id = formatArray(id);
            SA = formatArray(SA);
            let doctorArray = yield Doctors_Model_1.default
                .find({
                $or: [
                    Object.assign({ active: true, specialization: { $in: SA } }, (gender && { gender })),
                    {
                        _id: { $in: id },
                    },
                ],
            }, Object.assign({}, exports.excludeDoctorFields))
                .populate("specialization")
                .populate({ path: "qualification", select: { duration: 0 } })
                .populate({
                path: "hospitalDetails.hospital",
                populate: {
                    path: "address",
                    populate: { path: "city state locality country" },
                },
            })
                .lean();
            if (city) {
                doctorArray = doctorArray.filter((e) => {
                    let data = e.hospitalDetails.filter((elem) => {
                        return elem.hospital.address.city._id
                            ? elem.hospital.address.city._id.toString() === city
                            : false;
                    });
                    return data.length ? true : false;
                });
            }
            let arr = {};
            doctorArray.filter((e) => {
                e.hospitalDetails.filter((elem) => {
                    var _a, _b;
                    arr[e._id.toString()] = [
                        ...((_a = arr[e._id.toString()]) !== null && _a !== void 0 ? _a : []),
                        (_b = elem === null || elem === void 0 ? void 0 : elem.hospital) === null || _b === void 0 ? void 0 : _b._id.toString(),
                    ];
                });
            });
            let presciprtionValidty = yield Prescription_Model_1.default
                .find({
                doctorId: Object.keys(arr),
            })
                .lean();
            let d_in = [];
            doctorArray.forEach((e) => {
                e.hospitalDetails = e.hospitalDetails.map((elem) => {
                    let data = presciprtionValidty.filter((elements) => {
                        var _a, _b, _c, _d;
                        return (((_a = e === null || e === void 0 ? void 0 : e._id) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = elements === null || elements === void 0 ? void 0 : elements.doctorId) === null || _b === void 0 ? void 0 : _b.toString()) &&
                            ((_c = elem === null || elem === void 0 ? void 0 : elem.hospital) === null || _c === void 0 ? void 0 : _c._id.toString()) ===
                                ((_d = elements === null || elements === void 0 ? void 0 : elements.hospitalId) === null || _d === void 0 ? void 0 : _d.toString()));
                    })[0];
                    d_in = Object.assign({}, elem);
                    d_in.hospital["prescriptionValidity"] = data !== null && data !== void 0 ? data : [];
                    return d_in;
                });
                return e;
            });
            let data = doctorArray.map((e) => {
                var _a, _b, _c, _d, _e;
                return {
                    _id: e._id,
                    name: `${e.firstName} ${e.lastName}`,
                    specilization: (_a = e === null || e === void 0 ? void 0 : e.specialization[0]) === null || _a === void 0 ? void 0 : _a.specialityName,
                    Qualification: (_c = (_b = e === null || e === void 0 ? void 0 : e.qualification[0]) === null || _b === void 0 ? void 0 : _b.qualificationName) === null || _c === void 0 ? void 0 : _c.abbreviation,
                    experience: (_e = (_d = e === null || e === void 0 ? void 0 : e.totalExperience) !== null && _d !== void 0 ? _d : e === null || e === void 0 ? void 0 : e.overallExperience) !== null && _e !== void 0 ? _e : null,
                    profileImage: e === null || e === void 0 ? void 0 : e.image,
                };
            });
            // return successResponse(doctorArray, "Success", res);
            return (0, response_1.successResponse)(data, "Success", res);
        }))
            .catch((error) => {
            return (0, response_1.errorResponse)(error, res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.searchDoctor = searchDoctor;
const setSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let { workingHour } = req.body;
        const updateQuery = {
            $set: Object.assign({ doctorDetails: req.currentDoctor, hospitalDetails: body.hospitalId }, workingHour),
        };
        for (const iterator in workingHour) {
            if (!Object.keys(workingHour[iterator]).includes("capacity")) {
                const error = new Error("Invalid body");
                error.name = "Capacity is missing in the body";
                return (0, response_1.errorResponse)(error, res);
            }
        }
        let doctorProfile = yield Doctors_Model_1.default
            .findOne({
            "hospitalDetails.hospital": body.hospitalId,
            _id: req.currentDoctor,
        })
            .select({
            hospitalDetails: { $elemMatch: { hospital: body.hospitalId } },
        });
        let workingHourId = null;
        if (doctorProfile) {
            workingHourId = doctorProfile.hospitalDetails[0].workingHours;
        }
        const Wh = yield WorkingHours_Model_1.default.findOneAndUpdate({
            $or: [
                {
                    _id: workingHourId,
                },
                {
                    doctorDetails: req.currentDoctor,
                    hospitalDetails: body.hospitalId,
                },
            ],
        }, updateQuery, {
            upsert: true,
            new: true,
        });
        return (0, response_1.successResponse)({}, "Success", res);
        // return successResponse(Wh, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setSchedule = setSchedule;
const viewAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = 5;
        const skip = parseInt(req.params.page) * limit;
        const limitSkipSort = [
            {
                $sort: {
                    "time.date": -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ];
        const pipelines = [
            {
                $lookup: {
                    from: "hospitals",
                    localField: "hospital",
                    foreignField: "_id",
                    as: "hospital",
                },
            },
            {
                $unwind: "$hospital",
            },
            {
                $lookup: {
                    from: "addresses",
                    localField: "hospital.address",
                    foreignField: "_id",
                    as: "hospital.address",
                },
            },
            {
                $unwind: "$hospital.address",
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "hospital.address.city",
                    foreignField: "_id",
                    as: "hospital.address.city",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "hospital.address.state",
                    foreignField: "_id",
                    as: "hospital.address.state",
                },
            },
            {
                $lookup: {
                    from: "localities",
                    localField: "hospital.address.locality",
                    foreignField: "_id",
                    as: "hospital.address.locality",
                },
            },
            {
                $lookup: {
                    from: "countries",
                    localField: "hospital.address.country",
                    foreignField: "_id",
                    as: "hospital.address.country",
                },
            },
            {
                $unwind: "$hospital.address.city",
            },
            {
                $unwind: "$hospital.address.country",
            },
            {
                $unwind: "$hospital.address.state",
            },
            {
                $unwind: "$hospital.address.locality",
            },
            {
                $project: {
                    "hospital.doctors": 0,
                    "hospital.contactNumber": 0,
                    "hospital.payment": 0,
                    "hospital.anemity": 0,
                    "hospital.specialisedIn": 0,
                    "hospital.treatmentType": 0,
                    // "hospital.address": 0,
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
                $project: {
                    "patient.password": 0,
                    "patient.DOB": 0,
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
            {
                $project: {
                    "doctors.password": 0,
                    "doctors.hospitalDetails": 0,
                    "doctors.registration": 0,
                    "doctors.specialization": 0,
                    "doctors.KYCDetails": 0,
                    "doctors.qualification": 0,
                    "doctors.DOB": 0,
                    "doctors.phoneNumber": 0,
                },
            },
            {
                $unwind: "$hospital",
            },
            ...limitSkipSort,
        ];
        const doctorAppointments = yield Appointment_Model_1.default.aggregate([
            // {
            //   $match: {
            //     doctors: new mongoose.Types.ObjectId(req.currentDoctor),
            //   },
            // },
            {
                $facet: {
                    past: [
                        {
                            $match: {
                                doctors: new mongoose_1.default.Types.ObjectId(req.currentDoctor),
                                "time.date": { $lte: new Date() },
                            },
                        },
                        ...pipelines,
                    ],
                    upcoming: [
                        {
                            $match: {
                                doctors: new mongoose_1.default.Types.ObjectId(req.currentDoctor),
                                "time.date": { $gte: new Date() },
                            },
                        },
                        ...pipelines,
                    ],
                },
            },
        ]);
        return (0, response_1.successResponse)(doctorAppointments, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.viewAppointments = viewAppointments;
const viewAppointmentsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = 20;
        const skip = parseInt(req.params.page) * limit;
        const date = req.body.date;
        let d = new Date(date);
        const { hospital_id } = req.body;
        // console.log("date", d);
        // let gtDate: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        // let ltDate: Date = new Date(gtDate);
        // ltDate.setDate(gtDate.getDate() - 1);
        // ltDate.setUTCHours(24, 60, 60, 0);
        // gtDate.setDate(gtDate.getDate() + 1);
        // gtDate.setUTCHours(0, 0, 0, 0);
        let gtDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        let ltDate = new Date(gtDate);
        gtDate.setDate(gtDate.getDate() + 1);
        gtDate.setUTCHours(0, 0, 0, 0);
        let query = {
            doctors: req.currentDoctor,
            "time.date": {
                $gte: ltDate,
                $lte: gtDate,
            },
        };
        if (req.body.hospital) {
            query["hospital"] = req.body.hospital;
        }
        let appointments = yield Appointment_Model_1.default
            .find(query)
            .populate({ path: "patient", select: { password: 0, verified: 0 } })
            .populate({ path: "doctors", select: exports.excludeDoctorFields })
            .populate({ path: "hospital" })
            .populate({ path: "subPatient" })
            .limit(limit)
            .skip(skip)
            .lean();
        appointments.forEach((appointment) => {
            appointment.patient["age"] = (0, Patient_Service_1.calculateAge)(appointment.patient.DOB);
        });
        appointments = appointments.map((e) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            let time = e === null || e === void 0 ? void 0 : e.time;
            let subpatient = e === null || e === void 0 ? void 0 : e.subPatient;
            return {
                _id: (_a = e === null || e === void 0 ? void 0 : e.patient) === null || _a === void 0 ? void 0 : _a._id,
                name: `${(_b = e === null || e === void 0 ? void 0 : e.patient) === null || _b === void 0 ? void 0 : _b.firstName} ${(_c = e === null || e === void 0 ? void 0 : e.patient) === null || _c === void 0 ? void 0 : _c.lastName}`,
                age: (_d = e === null || e === void 0 ? void 0 : e.patient) === null || _d === void 0 ? void 0 : _d.age,
                gender: (_e = e === null || e === void 0 ? void 0 : e.patient) === null || _e === void 0 ? void 0 : _e.gender,
                timing: `${(_f = time === null || time === void 0 ? void 0 : time.from) === null || _f === void 0 ? void 0 : _f.time}:${(_g = time === null || time === void 0 ? void 0 : time.from) === null || _g === void 0 ? void 0 : _g.division} to ${(_h = time === null || time === void 0 ? void 0 : time.till) === null || _h === void 0 ? void 0 : _h.time}:${(_j = time === null || time === void 0 ? void 0 : time.till) === null || _j === void 0 ? void 0 : _j.division}`,
                hospital: {
                    _id: (_k = e === null || e === void 0 ? void 0 : e.hospital) === null || _k === void 0 ? void 0 : _k._id,
                    name: (_l = e === null || e === void 0 ? void 0 : e.hospital) === null || _l === void 0 ? void 0 : _l.name,
                },
                subPatient: Object.assign({}, ((subpatient === null || subpatient === void 0 ? void 0 : subpatient.firstName) && {
                    _id: subpatient === null || subpatient === void 0 ? void 0 : subpatient._id,
                    sub_pat_name: (subpatient === null || subpatient === void 0 ? void 0 : subpatient.firstName) &&
                        `${subpatient === null || subpatient === void 0 ? void 0 : subpatient.firstName} ${subpatient === null || subpatient === void 0 ? void 0 : subpatient.lastName}`,
                    sub_pat_age: (0, Patient_Service_1.calculateAge)(subpatient === null || subpatient === void 0 ? void 0 : subpatient.DOB),
                    sub_pat_gender: subpatient === null || subpatient === void 0 ? void 0 : subpatient.gender,
                })),
                // subPatient: {
                //   _id: subpatient?._id,
                //   sub_pat_name: `${subpatient?.firstName} ${subpatient?.lastName}`,
                //   sub_pat_age: subpatient?.DOB,
                //   sub_pat_gender: subpatient?.gender,
                // },
            };
        });
        if (hospital_id) {
            appointments = appointments.filter((e) => { var _a, _b; return ((_b = (_a = e === null || e === void 0 ? void 0 : e.hospital) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) === hospital_id; });
        }
        return (0, response_1.successResponse)({ patientdetails: appointments }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.viewAppointmentsByDate = viewAppointmentsByDate;
const cancelAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        // Check is appointment is already cancelled or is already done
        const appointmentCancelledOrDone = yield Appointment_Model_1.default.exists({
            _id: body.appointmentId,
            $or: [{ cancelled: true }, { done: true }],
        });
        // If appointment is done or cancelled, return an error response
        if (appointmentCancelledOrDone) {
            let error = new Error("Cannot cancel appointment, most likely beacuse appointment is already cancelled or is done");
            error.name = "Error cancelling appointment";
            return (0, response_1.errorResponse)(error, res);
        }
        else {
            // If not, cancel the appointment and return the success response
            const updatedAppointment = yield Appointment_Model_1.default.findOne({ _id: body.appointmentId }
            // { $set: { cancelled: true } },
            // { new: true }
            );
            updatedAppointment.cancelled = true;
            yield updatedAppointment.save();
            return (0, response_1.successResponse)(updatedAppointment, "Successfully cancelled appointment", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.cancelAppointments = cancelAppointments;
const getDoctorWorkingInHospitals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    try {
        let { timings } = req.body, { id: doctorId } = req.params;
        let doctors = yield hospitalService.hospitalsInDoctor(doctorId, timings);
        let doctordetails = {
            _id: doctors === null || doctors === void 0 ? void 0 : doctors._id,
            name: `${doctors.firstName} ${doctors.lastName}`,
            specilization: (_c = (_b = doctors === null || doctors === void 0 ? void 0 : doctors.specialization) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.specialityName,
            qualification: (_f = (_e = (_d = doctors === null || doctors === void 0 ? void 0 : doctors.qualification) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.qualificationName) === null || _f === void 0 ? void 0 : _f.name,
            experience: doctors === null || doctors === void 0 ? void 0 : doctors.overallExperience,
        };
        let day = new Date(timings).getDay();
        let WEEK_DAYS = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        let hospitaldetails = doctors === null || doctors === void 0 ? void 0 : doctors.hospitalDetails.map((e) => {
            var _a, _b, _c, _d, _e, _f, _g;
            let data = e === null || e === void 0 ? void 0 : e.hospital;
            return {
                id: data === null || data === void 0 ? void 0 : data._id,
                name: data === null || data === void 0 ? void 0 : data.name,
                address: `${(_b = (_a = data === null || data === void 0 ? void 0 : data.address) === null || _a === void 0 ? void 0 : _a.locality) === null || _b === void 0 ? void 0 : _b.name}, ${(_d = (_c = data === null || data === void 0 ? void 0 : data.address) === null || _c === void 0 ? void 0 : _c.city) === null || _d === void 0 ? void 0 : _d.name}`,
                fee: (_e = e === null || e === void 0 ? void 0 : e.consultationFee) === null || _e === void 0 ? void 0 : _e.min,
                prescription_validity: (_f = e === null || e === void 0 ? void 0 : e.prescription) === null || _f === void 0 ? void 0 : _f.validateTill,
                time: (_g = e === null || e === void 0 ? void 0 : e.workingHours) === null || _g === void 0 ? void 0 : _g.map((elem) => {
                    var _a, _b, _c, _d;
                    return `${(0, Utils_1.formatTimings)((_a = elem[WEEK_DAYS[day]]) === null || _a === void 0 ? void 0 : _a.from.time)}:${(0, Utils_1.formatTimings)((_b = elem[WEEK_DAYS[day]]) === null || _b === void 0 ? void 0 : _b.from.division)} to ${(0, Utils_1.formatTimings)((_c = elem[WEEK_DAYS[day]]) === null || _c === void 0 ? void 0 : _c.till.time)}:${(0, Utils_1.formatTimings)((_d = elem[WEEK_DAYS[day]]) === null || _d === void 0 ? void 0 : _d.till.division)}`;
                }),
                capacityAndToken: e === null || e === void 0 ? void 0 : e.workingHours.map((elem) => {
                    return {
                        capacity: elem[WEEK_DAYS[day]].capacity,
                        largestToken: elem[WEEK_DAYS[day]].appointmentsBooked,
                    };
                }),
                available: e === null || e === void 0 ? void 0 : e.available,
                scheduleAvailable: e === null || e === void 0 ? void 0 : e.scheduleAvailable,
                lat: data === null || data === void 0 ? void 0 : data.lat,
                lng: data === null || data === void 0 ? void 0 : data.lng,
                contactNumber: data === null || data === void 0 ? void 0 : data.contactNumber,
                status: data === null || data === void 0 ? void 0 : data.status,
                profileImage: data === null || data === void 0 ? void 0 : data.profileImage
            };
        });
        return (0, response_1.successResponse)({ doctordetails, hospitaldetails }, "Successs", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorWorkingInHospitals = getDoctorWorkingInHospitals;
const searchDoctorByPhoneNumberOrEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const term = req.params.term;
        const phone = (0, Validation_Service_1.phoneNumberValidation)(term);
        const email = (0, Validation_Service_1.emailValidation)(term);
        if (!phone && !email) {
            const error = new Error("Enter a valid phone number or email");
            error.name = "Invalid Term";
            return (0, response_1.errorResponse)(error, res);
        }
        const selectedFields = {
            firstName: 1,
            lastName: 1,
            gender: 1,
            DOB: 1,
            KYCDetails: 0,
            specialization: 1,
            qualification: 1,
            totalExperience: 1,
        };
        let doctorObj;
        if (phone) {
            doctorObj = yield Doctors_Model_1.default
                .findOne({
                phoneNumber: term,
            }, selectedFields)
                .populate("specialization qualification")
                .lean();
        }
        else if (email) {
            doctorObj = yield Doctors_Model_1.default
                .findOne({
                email: term,
            }, selectedFields)
                .populate("qualification specialization")
                .lean();
        }
        if (doctorObj) {
            doctorObj["age"] = (0, Patient_Service_1.calculateAge)(doctorObj["DOB"]);
            if (req.currentHospital) {
                let doctorExistInHospital = yield Hospital_Model_1.default.exists({
                    _id: req.currentHospital,
                    doctors: {
                        $in: [doctorObj._id],
                    },
                });
                if (doctorExistInHospital) {
                    doctorObj["existInHospital"] = true;
                }
                else {
                    doctorObj["existInHospital"] = false;
                }
            }
            return (0, response_1.successResponse)(doctorObj, "Success", res);
        }
        return (0, response_1.successResponse)({}, "No data found", res, 201);
    }
    catch (error) {
        if (typeof error == "string") {
            error = new Error(error);
            error.name = "Not Found";
        }
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.searchDoctorByPhoneNumberOrEmail = searchDoctorByPhoneNumberOrEmail;
const getHospitalListByDoctorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorData = yield Doctors_Model_1.default
            .findOne({ _id: req.params.id, deleted: false }, exports.excludeDoctorFields)
            .select({
            "hospitalDetails.consultationFee": 0,
            "hospitalDetails.workingHours": 0,
        })
            .populate({
            path: "hospitalDetails.hospital",
            populate: {
                path: "address",
                populate: {
                    path: "city state locality country",
                },
            },
            select: {
                doctors: 0,
                location: 0,
                specialisedIn: 0,
                anemity: 0,
                treatmentType: 0,
                type: 0,
                payment: 0,
                deleted: 0,
                openingHour: 0,
                numberOfBed: 0,
            },
        });
        if (doctorData) {
            let hospitalDetails = doctorData.hospitalDetails.map((e) => {
                return e.hospital;
            });
            // "hospitalDetails":[
            //   {
            //   "id":"535435353",
            //   "name":"Tulsi hospital",
            //   }
            //   ]
            hospitalDetails = hospitalDetails.map((e) => {
                return {
                    _id: e._id,
                    name: e.name,
                };
            });
            return (0, response_1.successResponse)({ hospitalDetails }, "Successfully fetched doctor details", res);
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
exports.getHospitalListByDoctorId = getHospitalListByDoctorId;
const checkDoctorAvailability = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const time = new Date(body.time.date);
    let d = time.getDay();
    let query = {
        doctorDetails: body.doctors,
        hospitalDetails: body.hospital,
    };
    if (d == 0) {
        d = "sunday";
        query["sunday.working"] = true;
        query["sunday.from.time"] = body.time.from.time;
        query["sunday.from.division"] = body.time.from.division;
        query["sunday.till.time"] = body.time.till.time;
        query["sunday.till.division"] = body.time.till.division;
    }
    else if (d == 1) {
        query["monday.working"] = true;
        query["monday.from.time"] = body.time.from.time;
        query["monday.from.division"] = body.time.from.division;
        query["monday.till.time"] = body.time.till.time;
        query["monday.till.division"] = body.time.till.division;
    }
    else if (d == 2) {
        query["tuesday.working"] = true;
        query["tuesday.from.time"] = body.time.from.time;
        query["tuesday.from.division"] = body.time.from.division;
        query["tuesday.till.time"] = body.time.till.time;
        query["tuesday.till.division"] = body.time.till.division;
    }
    else if (d == 3) {
        query["wednesday.working"] = true;
        query["wednesday.from.time"] = body.time.from.time;
        query["wednesday.from.division"] = body.time.from.division;
        query["wednesday.till.time"] = body.time.till.time;
        query["wednesday.till.division"] = body.time.till.division;
    }
    else if (d == 4) {
        query["thursday.working"] = true;
        query["thursday.from.time"] = body.time.from.time;
        query["thursday.from.division"] = body.time.from.division;
        query["thursday.till.time"] = body.time.till.time;
        query["thursday.till.division"] = body.time.till.division;
    }
    else if (d == 5) {
        query["friday.working"] = true;
        query["friday.from.time"] = body.time.from.time;
        query["friday.from.division"] = body.time.from.division;
        query["friday.till.time"] = body.time.till.time;
        query["friday.till.division"] = body.time.till.division;
    }
    else if (d == 6) {
        query["saturday.working"] = true;
        query["saturday.from.time"] = body.time.from.time;
        query["saturday.from.division"] = body.time.from.division;
        query["saturday.till.time"] = body.time.till.time;
        query["saturday.till.division"] = body.time.till.division;
    }
    // @TODO check if working hour exist first
    let capacity = yield WorkingHours_Model_1.default.findOne(query);
    if (!capacity) {
        let error = new Error("Error");
        error.message = "Doctor not available";
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
        return {
            status: false,
            message: "Doctor not available on this day",
        };
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
        return {
            status: false,
            message: "Doctor cannot take any more appointments",
        };
    }
    return {
        status: true,
        message: "Doctor is available",
    };
});
exports.checkDoctorAvailability = checkDoctorAvailability;
const getTotalEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const totalEarnings = await appointmentPaymentModel.aggregate([
        //   {
        //     $lookup: {
        //       from: "orders",
        //       localField: "orderId",
        //       foreignField: "_id",
        //       as: "orderId",
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: "$orderId",
        //     },
        //   },
        //   {
        //     $lookup: {
        //       from: "appointments",
        //       localField: "orderId.appointmentDetails",
        //       foreignField: "_id",
        //       as: "orderId.appointmentDetails",
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: "$orderId.appointmentDetails",
        //     },
        //   },
        //   {
        //     $match: {
        //       "orderId.appointmentDetails.doctors": new mongoose.Types.ObjectId(
        //         req.currentDoctor
        //       ),
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: "$orderId.appointmentDetails.doctors",
        //       totalEarnings: {
        //         $sum: "$orderId.amount",
        //       },
        //     },
        //   },
        // ]);
        const totalEarnings = yield doctorService.getTotalEarnings(req.currentDoctor);
        return (0, response_1.successResponse)(totalEarnings, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getTotalEarnings = getTotalEarnings;
const getAvailableAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalEarnings = yield doctorService.getTotalEarnings(req.currentDoctor);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAvailableAmount = getAvailableAmount;
const getPendingAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield doctorService.getUser(req);
        const pendingBalance = yield doctorService.getPendingAmount(user);
        return (0, response_1.successResponse)(pendingBalance, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getPendingAmount = getPendingAmount;
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = schemaNames_1.doctor;
        let id = req.currentDoctor
            ? req.currentDoctor
            : req.currentHospital;
        if (req.currentHospital) {
            user = schemaNames_1.hospital;
        }
        const body = req.body;
        const pendingAmount = yield doctorService.getPendingAmount(id);
        if (body.withdrawalAmount > pendingAmount) {
            let error = new Error("Insufficient Balance");
            error.name = "Not sufficient balance.";
            return (0, response_1.errorResponse)(error, res);
        }
        else {
            const receiptNumber = Math.floor(100000 + Math.random() * 900000).toString();
            const todayDate = new Date();
            yield new Withdrawal_Model_1.default({
                withdrawalAmount: req.body.withdrawalAmount,
                withdrawnBy: id,
                user: user,
                withdrawalReceipt: `wthdrw_${receiptNumber}`,
                createdAt: todayDate,
            }).save();
            return (0, response_1.successResponse)({
                withdrawalReceipt: `wthdrw_${receiptNumber}`,
                withdrawalAmount: req.body.withdrawalAmount,
                withdrawalDate: todayDate,
            }, "Success", res);
        }
        // const Promise_TotalEarnings = doctorService.getTotalEarnings(req);
        // const [pendingAmount, totalEarnings] = Promise.all([
        //   Promise_PendingAmount,
        //   Promise_TotalEarnings,
        // ]);
    }
    catch (error) {
        let err = new Error(error);
        return (0, response_1.errorResponse)(err, res);
    }
});
exports.withdraw = withdraw;
const getAppointmentSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cancelledAppointments = Appointment_Model_1.default
            .find({
            doctors: req.currentDoctor,
            cancelled: true,
        })
            .count();
        let doneAppointments = Appointment_Model_1.default
            .find({
            doctors: req.currentDoctor,
            done: true,
        })
            .count();
        let totalAppointments = Appointment_Model_1.default
            .find({
            doctors: req.currentDoctor,
        })
            .count();
        [cancelledAppointments, doneAppointments, totalAppointments] =
            yield Promise.all([
                cancelledAppointments,
                doneAppointments,
                totalAppointments,
            ]);
        return (0, response_1.successResponse)({
            cancelledAppointments,
            doneAppointments,
            totalAppointments,
        }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAppointmentSummary = getAppointmentSummary;
const deleteSpecializationAndQualification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keys = ["specialization", "qualification"];
        let body = req.body;
        for (const key in body) {
            if (!keys.includes(key)) {
                let error = new Error(`${key} is not an acceptable key in the request body`);
                error.name = "Invalid request";
                throw error;
            }
        }
        if (body[Object.keys(body)[0]].length == 0) {
            throw new Error("Doctor must have at least on specialization");
        }
        let updateQuery = {
            $set: body,
        };
        const updatedDoctor = yield Doctors_Model_1.default.findOneAndUpdate({
            _id: req.currentDoctor,
        }, updateQuery);
        if (!updatedDoctor) {
            throw new Error("Doctor does not exist");
        }
        return (0, response_1.successResponse)({}, "success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteSpecializationAndQualification = deleteSpecializationAndQualification;
// verify payment ka issue
const deleteHospitalFromDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        const doctor = yield Doctors_Model_1.default.findOne({ _id: req.currentDoctor });
        const hospital = doctor.hospitalDetails.filter((e, index) => {
            // if (index == doctor.hospitalDetails.length - 1) {
            //   throw new Error("Doctor is not appointed in this hospital");
            // }
            return e.hospital != body.hospital;
        });
        // await doctor.save();
        yield doctor.update({ $set: { hospitalDetails: hospital } });
        return (0, response_1.successResponse)(doctor, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteHospitalFromDoctor = deleteHospitalFromDoctor;
const updateQualification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let updateBody = {
            $set: body,
        };
        const qualification = yield Qualification_Model_1.default.findOneAndUpdate({
            _id: req.params.qualificationId,
        }, updateBody, {
            new: true,
        });
        if (qualification) {
            return (0, response_1.successResponse)(qualification, "Success", res);
        }
        throw new Error("Qualification doesn't exist");
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.updateQualification = updateQualification;
const checkVerificationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorProfile = yield Doctors_Model_1.default.findOne({
            phoneNumber: req.body.phoneNumber,
            login: true,
            deleted: false,
        }, {
            password: 0,
            registrationDate: 0,
            DOB: 0,
            registration: 0,
            KYCDetails: 0,
        });
        if (!doctorProfile) {
            let error = new Error("Profile doesn't exist");
            error.name = "Not Found";
            throw error;
        }
        if (!doctorProfile.verified) {
            let error = new Error("Your profile is under verification");
            error.name = "Unverified Profile";
            throw error;
        }
        yield doctorProfile.populate("qualification");
        let { firstName, lastName, gender, phoneNumber, email, _id, qualification, } = doctorProfile.toJSON();
        qualification = qualification[0];
        let token = yield doctorService.getDoctorToken(doctorProfile.toJSON());
        return (0, response_1.successResponse)({
            token,
            firstName,
            lastName,
            gender,
            phoneNumber,
            email,
            _id,
            qualification,
        }, "Your profile is verified", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.checkVerificationStatus = checkVerificationStatus;
/* Hospital khud ko doctor ki profile me add kr ske */
const addHospitalInDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _g = req.body, { doctorId } = _g, rest = __rest(_g, ["doctorId"]);
        let keys = Object.keys(rest);
        if (!(keys.includes("hospital") &&
            keys.includes("workingHours") &&
            keys.includes("consultationFee"))) {
            return (0, response_1.errorResponse)(new Error("Incorrent or improper number of values in request body"), res, 402);
        }
        let all_workingHours = (yield WorkingHours_Model_1.default.find({ doctorDetails: doctorId, hospitalDetails: req.currentHospital }, { _id: 1 })).map((e) => e._id.toString());
        if (!all_workingHours.includes(rest.workingHours)) {
            return (0, response_1.errorResponse)(new Error("The working hour you've sent does not belong to this doctor and hospital"), res, 402);
        }
        let doctor = yield Doctors_Model_1.default.findOneAndUpdate({
            _id: doctorId,
        }, {
            $addToSet: {
                hospitalDetails: [
                    {
                        hospital: rest.hospital,
                        consultationFee: rest.consultationFee,
                    },
                ],
            },
        });
        if (doctor) {
            return (0, response_1.successResponse)({}, "Successfully updated profile", res);
        }
        else {
            return (0, response_1.errorResponse)(new Error("Doctor doesn't exist"), res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addHospitalInDoctorProfile = addHospitalInDoctorProfile;
const setConsultationFeeForDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield doctorService.setConsultationFeeForDoctor(req.currentDoctor ? req.currentDoctor : req.body.doctorId, req.body.hospitalId, req.body.consultationFee);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setConsultationFeeForDoctor = setConsultationFeeForDoctor;
const getListOfRequestedApprovals_OfDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorId = req.currentDoctor;
        let data = yield approvalService.getListOfRequestedApprovals_OfDoctor(doctorId);
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getListOfRequestedApprovals_OfDoctor = getListOfRequestedApprovals_OfDoctor;
const getListOfRequestedApprovals_ByDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorId = req.currentDoctor;
        let data = yield approvalService.getListOfRequestedApprovals_ByDoctor(doctorId);
        let data2 = yield approvalService.getListOfRequestedApprovals_OfDoctor(doctorId);
        let response = [...data, ...data2];
        return (0, response_1.successResponse)(response, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getListOfRequestedApprovals_ByDoctor = getListOfRequestedApprovals_ByDoctor;
const getDoctorsOfflineAndOnlineAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appointments = yield doctorService.getDoctorsOfflineAndOnlineAppointments(req.currentDoctor);
        return (0, response_1.successResponse)(appointments, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorsOfflineAndOnlineAppointments = getDoctorsOfflineAndOnlineAppointments;
const notificationService = __importStar(require("../Services/Notification/Notification.Service"));
const Prescription_Model_1 = __importDefault(require("../Models/Prescription.Model"));
const Utils_1 = require("../Services/Utils");
const Suvedha_Model_1 = __importDefault(require("../Models/Suvedha.Model"));
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
const Holiday_Calendar_Model_1 = __importDefault(require("../Models/Holiday-Calendar.Model"));
const Helpers_1 = require("../Services/Helpers");
const getDoctorsNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* Notification jaha pe sender hospital hai */
        let notifications_whereSenderIsHospital = notificationService.getDoctorsNotification_whenSenderIsHospital_approvalRequest(req.currentDoctor);
        /* Notification jaha pe sender patient hai */
        let notifications_whereSenderIsPatient = notificationService.getDoctorsNotification_whenSenderIsPatient(req.currentDoctor);
        Promise.all([
            notifications_whereSenderIsHospital,
            notifications_whereSenderIsPatient,
        ])
            .then((result) => {
            console.log(":lknjbhjgvh bfdfdf", result);
            let notifications = result.map((e) => e[0]);
            notifications = notifications.sort((a, b) => a.createdAt - b.createdAt);
            notifications = notifications.filter((e) => e);
            return (0, response_1.successResponse)(notifications, "Success", res);
        })
            .catch((error) => (0, response_1.errorResponse)(error, res));
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorsNotification = getDoctorsNotification;
/* Holiday calendar */
const setHolidayCalendar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let holiday = yield holidayService.addHolidayCalendar({
            doctorId: req.body.doctorId,
            hospitalId: req.body.hospitalId,
            date: req.body.date,
        });
        return (0, response_1.successResponse)(holiday, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setHolidayCalendar = setHolidayCalendar;
const getDoctorsHolidayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorId = "", hospitalId = req.body.hospitalId;
        if (req.currentDoctor) {
            doctorId = req.currentDoctor;
        }
        else {
            doctorId = req.body.doctorId;
        }
        let { year, month } = req.body;
        let holidayList = yield holidayService.getDoctorsHolidayList(doctorId, year, month, hospitalId);
        return (0, response_1.successResponse)(holidayList, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorsHolidayList = getDoctorsHolidayList;
const deleteHolidayCalendar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield holidayService.deleteHolidayCalendar(req.body.holidayId);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteHolidayCalendar = deleteHolidayCalendar;
const getHospitalsOfflineAndOnlineAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appointments = yield hospitalService.getHospitalsOfflineAndOnlineAppointments(req.query.hospitalId, req.body.date);
        return (0, response_1.successResponse)(appointments, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getHospitalsOfflineAndOnlineAppointments = getHospitalsOfflineAndOnlineAppointments;
const getListOfAllAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appointment = yield doctorService.getListOfAllAppointments(req.currentDoctor, req.params.page);
        return (0, response_1.successResponse)(appointment, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getListOfAllAppointments = getListOfAllAppointments;
const getAppointmentFeeFromAppointmentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, response_1.successResponse)(yield doctorService.getAppointmentFeeFromAppointmentId(req.params.appointmentId), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAppointmentFeeFromAppointmentId = getAppointmentFeeFromAppointmentId;
const getPrescriptionValidityAndFeesOfDoctorInHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorId;
        let hospitalId = req.body.hospitalId;
        if (req.currentDoctor) {
            doctorId = req.currentDoctor;
        }
        else {
            doctorId = req.body.doctorId;
        }
        let data = yield prescriptionController.getPrescriptionValidityAndFeesOfDoctorInHospital(hospitalId, doctorId);
        let [p, c] = data;
        return (0, response_1.successResponse)(Object.assign(Object.assign({}, p), c), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getPrescriptionValidityAndFeesOfDoctorInHospital = getPrescriptionValidityAndFeesOfDoctorInHospital;
const likeADoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { likedDoctorId, likedById } = req.body;
        console.log("bvdsds dsdds", req.currentHospital);
        console.log("dsdsdsdssd", req.currentSuvedha);
        let hospitalExist = yield hospitalService.doesHospitalExist(likedById);
        let reference;
        if (hospitalExist) {
            reference = schemaNames_1.hospital;
        }
        if (req.currentSuvedha) {
            reference = schemaNames_1.suvedha;
        }
        let likedDoctor = yield doctorService.likeDoctor(likedDoctorId, likedById, reference);
        return (0, response_1.successResponse)(likedDoctor, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.likeADoctor = likeADoctor;
const unlikeDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { likedDoctorId, likedById } = req.body;
        let hospitalExist = yield hospitalService.doesHospitalExist(likedById);
        let reference;
        if (hospitalExist) {
            reference = schemaNames_1.hospital;
        }
        let unlikeDoctor = yield doctorService.unlikeDoctor(likedDoctorId, likedById, reference);
        return (0, response_1.successResponse)(unlikeDoctor, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(new Error(error), res);
    }
});
exports.unlikeDoctor = unlikeDoctor;
const getMyLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId } = req.currentDoctor;
        if (!doctorId) {
            doctorId = req.body.doctorId;
        }
        let likes = yield doctorService.getMyLikes(doctorId);
        return (0, response_1.successResponse)(likes, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getMyLikes = getMyLikes;
const getSpecializationByCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { cityId } = req.query;
        let hospitals = yield (0, Patient_Service_1.getHospitalsInACity)(cityId);
        hospitals = hospitals.map((e) => {
            return {
                _id: e._id.toString(),
            };
        });
        let docsInHospitals = yield doctorService.getDoctorsInHospitalByQuery({
            _id: { $in: hospitals },
            $expr: { $gt: [{ $size: "$doctors" }, 0] },
        }, {
            doctors: 1,
        });
        let specality = docsInHospitals
            .map((hospital) => {
            return hospital.doctors.map((docs) => docs.specialization).flat();
        })
            .flat();
        // const Conn = mongoose.createConnection();
        // await Conn.openUri(<string>process.env.DB_PATH);
        // const special = Conn.collection("special").find({
        //   _id: { $in: specality.flat() },
        // });
        const special = Specialization_Model_1.default.find({ _id: { $in: specality.flat() } });
        let SBD = yield Promise.all([special]);
        let [S] = SBD;
        // Conn.close();
        return (0, response_1.successResponse)({ Speciality: S }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getSpecializationByCity = getSpecializationByCity;
const sendOTPToUpdateNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Utils_1.sendOTPForPasswordChange)(req.body.phoneNumber);
        return (0, response_1.successResponse)({}, "OTP send successfully", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.sendOTPToUpdateNumber = sendOTPToUpdateNumber;
const verifyOTPToUpdateNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { phoneNumber, OTP, newPhoneNumber } = req.body;
        if (!newPhoneNumber) {
            throw new Error("Enter new phone number");
        }
        let result = true;
        if (!["TEST"].includes(process.env.ENVIRONMENT)) {
            result = yield (0, Utils_1.verifyPasswordChangeOTP)(newPhoneNumber, OTP);
        }
        // let result = await verifyPasswordChangeOTP(newPhoneNumber, OTP);
        if (result) {
            let exist = yield Doctors_Model_1.default.exists({
                phoneNumber: newPhoneNumber,
            });
            let existHospital = Hospital_Model_1.default.exists({
                contactNumber: newPhoneNumber,
            });
            let existSuvedha = Suvedha_Model_1.default.exists({ phoneNumber: newPhoneNumber });
            let existPatient = Patient_Model_1.default.exists({ phoneNumber: newPhoneNumber });
            let existResult = yield Promise.all([
                exist,
                existHospital,
                existSuvedha,
                existPatient,
            ]);
            // if (exist) {
            if (existResult.includes(true)) {
                throw new Error("Phone number already exist");
            }
            let userData = yield Doctors_Model_1.default.findOne({ phoneNumber });
            Doctors_Model_1.default
                .findOneAndUpdate({
                _id: userData._id,
            }, {
                $set: {
                    phoneNumber: newPhoneNumber,
                    phoneNumberUpdate: true,
                },
            })
                .then((res) => console.log("resss", res));
            return (0, response_1.successResponse)({}, "Success", res);
        }
        else {
            throw new Error("Invalid OTP");
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.verifyOTPToUpdateNumber = verifyOTPToUpdateNumber;
const deleteDoctorQualification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { qualificationId } = req.body;
        Doctors_Model_1.default
            .findOneAndUpdate({
            _id: req.currentDoctor,
        }, {
            $pull: { qualification: qualificationId },
        })
            .then((result) => {
            console.log("jgdshbds sdds", result);
        });
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteDoctorQualification = deleteDoctorQualification;
const getDoctorQualificationList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctor = yield Doctors_Model_1.default
            .findOne({ _id: req.currentDoctor })
            .populate("qualification");
        let { qualification } = doctor;
        qualification = qualification.map((e) => ({
            id: e._id,
            name: e.qualificationName.abbreviation,
            certificationorgnisation: e.certificationOrganisation,
        }));
        return (0, response_1.successResponse)(qualification, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorQualificationList = getDoctorQualificationList;
const getDoctorsAllHolidayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.body.doctorId;
        const hospitalId = req.body.hospitalId;
        let [startDate, endDate] = [req.body.startDate, req.body.endDate];
        let workingDaysPromise = WorkingHours_Model_1.default.find({ doctorDetails: doctorId, hospitalDetails: hospitalId }).lean();
        let holidaysPromise = Holiday_Calendar_Model_1.default.find({ doctorId, hospitalId, date: { $gte: startDate, $lte: endDate } }).lean();
        let [workingDaysArray, holidays] = yield Promise.all([workingDaysPromise, holidaysPromise]);
        let offDays, holidayDates = [];
        offDays = doctorService.getDoctorsOffDaysForADateRange(workingDaysArray, startDate, endDate);
        holidayDates = holidays.map((e) => e === null || e === void 0 ? void 0 : e.date);
        return (0, response_1.successResponse)(Object.assign(Object.assign({}, offDays), { holidayDates }), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorsAllHolidayList = getDoctorsAllHolidayList;
const setThatDoctorTakesOverTheCounterPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, hospitalId } = req.body;
        if (!(doctorId && hospitalId)) {
            const error = new Error("Invalid doctor or hospital");
            throw error;
        }
        const createdBy = req.currentDoctor ? Helpers_1.UserType.DOCTOR : Helpers_1.UserType.HOSPITAL;
        yield doctorService.setThatDoctorTakesOverTheCounterPayments(doctorId, hospitalId, createdBy);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setThatDoctorTakesOverTheCounterPayments = setThatDoctorTakesOverTheCounterPayments;
const deleteThatDoctorTakesOverTheCounterPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, hospitalId } = req.query;
        if (!(doctorId && hospitalId)) {
            const error = new Error("Invalid doctor or hospital");
            throw error;
        }
        yield doctorService.deleteThatDoctorTakesOverTheCounterPayments(doctorId, hospitalId);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteThatDoctorTakesOverTheCounterPayments = deleteThatDoctorTakesOverTheCounterPayments;
const checkIfDoctorTakesOverTheCounterPaymentsForAHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, hospitalId } = req.query;
        console.log("checkIfDoctorTakesOverTheCounterPaymentsForAHospital: ", req.query);
        if (!(doctorId && hospitalId)) {
            const error = new Error("Invalid doctor or hospital");
            throw error;
        }
        const exist = yield doctorService.checkIfDoctorTakesOverTheCounterPaymentsForAHospital(doctorId, hospitalId);
        return (0, response_1.successResponse)(exist, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.checkIfDoctorTakesOverTheCounterPaymentsForAHospital = checkIfDoctorTakesOverTheCounterPaymentsForAHospital;
const setDoctorsAdvancedBookingPeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, hospitalId, bookingPeriod } = req.body;
        if (!(doctorId && hospitalId)) {
            const error = new Error("Invalid doctor or hospital");
            throw error;
        }
        yield doctorService.setDoctorsAdvancedBookingPeriod(doctorId, hospitalId, bookingPeriod);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setDoctorsAdvancedBookingPeriod = setDoctorsAdvancedBookingPeriod;
const deleteDoctorsAdvancedBookingPeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, hospitalId } = req.query;
        if (!(doctorId && hospitalId)) {
            const error = new Error("Invalid doctor or hospital");
            throw error;
        }
        yield doctorService.deleteDoctorsAdvancedBookingPeriod(doctorId, hospitalId);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteDoctorsAdvancedBookingPeriod = deleteDoctorsAdvancedBookingPeriod;
const getDoctorsAdvancedBookingPeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, hospitalId } = req.query;
        if (!(doctorId && hospitalId)) {
            const error = new Error("Invalid doctor or hospital");
            throw error;
        }
        const exist = yield doctorService.getDoctorsAdvancedBookingPeriod(doctorId, hospitalId);
        return (0, response_1.successResponse)(exist, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorsAdvancedBookingPeriod = getDoctorsAdvancedBookingPeriod;
const resendOtpToDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        yield (0, Utils_1.sendOTPToPhoneNumber)(phoneNumber);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.resendOtpToDoctor = resendOtpToDoctor;
