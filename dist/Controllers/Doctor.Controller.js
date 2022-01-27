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
exports.getHospitalListByDoctorId = exports.searchDoctorByPhoneNumberOrEmail = exports.getDoctorWorkingInHospitals = exports.cancelAppointments = exports.viewAppointmentsByDate = exports.viewAppointments = exports.setSchedule = exports.searchDoctor = exports.deleteProfile = exports.updateDoctorProfile = exports.getDoctorByHospitalId = exports.getDoctorById = exports.doctorLogin = exports.createDoctor = exports.getAllDoctorsList = exports.excludeDoctorFields = void 0;
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const OTP_Model_1 = __importDefault(require("../Models/OTP.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const response_1 = require("../Services/response");
const message_service_1 = require("../Services/message.service");
const SpecialityBody_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityBody.Model"));
const underscore_1 = __importDefault(require("underscore"));
const SpecialityDisease_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityDisease.Model"));
const schemaNames_1 = require("../Services/schemaNames");
const SpecialityDoctorType_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityDoctorType.Model"));
const WorkingHours_Model_1 = __importDefault(require("../Models/WorkingHours.Model"));
const mongoose_1 = __importDefault(require("mongoose"));
const Appointment_Model_1 = __importDefault(require("../Models/Appointment.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const Patient_Controller_1 = require("./Patient.Controller");
const Validation_Service_1 = require("../Services/Validation.Service");
exports.excludeDoctorFields = {
    password: 0,
    // panCard: 0,
    // adhaarCard: 0,
    verified: 0,
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
        let cryptSalt = yield bcrypt.genSalt(10);
        body.password = yield bcrypt.hash(body.password, cryptSalt);
        let doctorObj = yield new Doctors_Model_1.default(body).save();
        jwt.sign(doctorObj.toJSON(), process.env.SECRET_DOCTOR_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            const { firstName, lastName, gender, phoneNumber, _id } = doctorObj;
            return (0, response_1.successResponse)({ token, firstName, lastName, gender, phoneNumber, _id }, "Doctor profile successfully created", res);
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
                if (!(body.phoneNumber == "9999999999")) {
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
                const profile = yield Doctors_Model_1.default.findOne({
                    phoneNumber: body.phoneNumber,
                    deleted: false,
                }, exports.excludeDoctorFields);
                const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_DOCTOR_KEY);
                const { firstName, lastName, gender, phoneNumber, email, _id } = profile.toJSON();
                return (0, response_1.successResponse)({ token, firstName, lastName, gender, phoneNumber, email, _id }, "Successfully logged in", res);
            }
            const otpData = yield OTP_Model_1.default.findOne({
                phoneNumber: body.phoneNumber,
            });
            try {
                const data = yield jwt.verify(otpData.otp, body.OTP);
                if (Date.now() > data.expiresIn)
                    return (0, response_1.errorResponse)(new Error("OTP expired"), res);
                if (body.OTP === data.otp) {
                    const profile = yield Doctors_Model_1.default.findOne({
                        phoneNumber: body.phoneNumber,
                        deleted: false,
                    }, exports.excludeDoctorFields);
                    if (profile) {
                        const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_DOCTOR_KEY);
                        otpData.remove();
                        const { firstName, lastName, gender, phoneNumber, email, _id } = profile.toJSON();
                        return (0, response_1.successResponse)({ token, firstName, lastName, gender, phoneNumber, email, _id }, "Successfully logged in", res);
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
exports.doctorLogin = doctorLogin;
// Get Doctor By Doctor Id
const getDoctorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorData = yield Doctors_Model_1.default
            .findOne({ _id: req.params.id, deleted: false }, exports.excludeDoctorFields)
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
            .populate("qualification");
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
const updateDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _a = req.body, { hospitalDetails, specialization, qualification } = _a, body = __rest(_a, ["hospitalDetails", "specialization", "qualification"]);
        const updateQuery = {
            $set: body,
            $addToSet: { hospitalDetails, specialization, qualification },
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
        const doctorProfile = yield Doctors_Model_1.default.findOneAndUpdate({ _id: req.currentDoctor, deleted: false }, { $set: { deleted: true } });
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
        ];
        Promise.all(promiseArray)
            .then((specialityArray) => __awaiter(void 0, void 0, void 0, function* () {
            specialityArray = specialityArray.flat();
            specialityArray = underscore_1.default.map(specialityArray, (e) => {
                return e.speciality;
            });
            const doctorArray = yield Doctors_Model_1.default
                .find({
                deleted: false,
                active: true,
                specialization: { $in: specialityArray },
            }, Object.assign(Object.assign({}, exports.excludeDoctorFields), { "hospitalDetails.hospital": 0, "hospitalDetails.workingHours": 0 }))
                .populate("specialization")
                // .populate("hospitalDetails.hospital")
                .populate({
                path: "qualification",
                select: {
                    duration: 0,
                },
            });
            return (0, response_1.successResponse)(doctorArray, "Success", res);
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
        return (0, response_1.successResponse)(Wh, "Success", res);
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
        const limit = 2;
        const skip = parseInt(req.params.page) * limit;
        const date = req.body.date;
        let d = new Date(date);
        let gtDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        let ltDate = new Date(gtDate);
        ltDate.setDate(gtDate.getDate() - 1);
        ltDate.setUTCHours(24, 60, 60, 0);
        gtDate.setDate(gtDate.getDate() + 1);
        gtDate.setUTCHours(0, 0, 0, 0);
        const appointments = yield Appointment_Model_1.default
            .find({
            doctors: req.currentDoctor,
            "time.date": {
                $gte: ltDate,
                $lte: gtDate,
            },
        })
            .populate({ path: "patient", select: Patient_Controller_1.excludePatientFields })
            .populate({ path: "doctors", select: exports.excludeDoctorFields })
            .populate({ path: "hospital" })
            .limit(limit)
            .skip(skip);
        return (0, response_1.successResponse)(appointments, "Success", res);
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
            const updatedAppointment = yield Appointment_Model_1.default.findOneAndUpdate({ _id: body.appointmentId }, { $set: { cancelled: true } }, { new: true });
            return (0, response_1.successResponse)(updatedAppointment, "Successfully cancelled appointment", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.cancelAppointments = cancelAppointments;
const getDoctorWorkingInHospitals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorDetails = yield Doctors_Model_1.default
            .findOne({ _id: req.params.id }, Object.assign(Object.assign({}, exports.excludeDoctorFields), { hospitalDetails: 0 }))
            .populate("specialization qualification");
        let workingHourObj = yield WorkingHours_Model_1.default
            .find({
            doctorDetails: req.params.id,
        })
            .distinct("hospitalDetails");
        let hospitals = yield Hospital_Model_1.default
            .find({ _id: { $in: workingHourObj } }, {
            payment: 0,
        })
            .populate({
            path: "address",
            populate: {
                path: "city state locality country",
            },
        })
            .populate("anemity")
            .populate("openingHour");
        const doctorObj = yield WorkingHours_Model_1.default.aggregate([
            {
                $match: {
                    doctorDetails: new mongoose_1.default.Types.ObjectId(req.params.id),
                },
            },
            {
                $project: {
                    hospitalDetails: 1,
                    monday: 1,
                    tuesday: 1,
                    wednesday: 1,
                    thursday: 1,
                    friday: 1,
                    saturday: 1,
                    sunday: 1,
                },
            },
            {
                $group: {
                    _id: "$hospitalDetails",
                    workingHours: {
                        $push: {
                            monday: "$monday",
                            tuesday: "$tuesday",
                            wednesday: "$wednesday",
                            thursday: "$thursday",
                            friday: "$friday",
                            saturday: "$saturday",
                            sunday: "$sunday",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "hospitals",
                    localField: "_id",
                    foreignField: "_id",
                    as: "hospital",
                },
            },
            {
                $project: {
                    workingHours: 1,
                },
            },
        ]);
        let index;
        let doctorsWorkingInHospital = hospitals.map((element) => {
            index = doctorObj.findIndex((e) => {
                return e._id.toString() == element._id.toString();
            });
            return Object.assign({ hospital: element }, doctorObj[index]);
        });
        return (0, response_1.successResponse)({ doctorDetails, doctorsWorkingInHospital }, "Success", res);
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
        const doctorObj = yield Doctors_Model_1.default.find({
            $or: [
                {
                    email: term,
                },
                {
                    phoneNumber: term,
                },
            ],
        });
        if (doctorObj) {
            return (0, response_1.successResponse)(doctorObj, "Success", res);
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
            const hospitalDetails = doctorData.hospitalDetails.map((e) => {
                return e.hospital;
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
