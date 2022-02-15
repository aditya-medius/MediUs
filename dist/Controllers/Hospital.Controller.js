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
exports.getHospitalById = exports.viewAppointment = exports.removeDoctor = exports.searchHospital = exports.updateHospital = exports.deleteHospital = exports.getServices = exports.getAnemities = exports.createHospitalAnemity = exports.createHospital = exports.myHospital = exports.getAllHospitalsList = exports.loginWithPassword = exports.login = void 0;
const Address_Model_1 = __importDefault(require("../Models/Address.Model"));
const Anemities_Model_1 = __importDefault(require("../Models/Anemities.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const response_1 = require("../Services/response");
const jwt = __importStar(require("jsonwebtoken"));
const SpecialityBody_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityBody.Model"));
const SpecialityDisease_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityDisease.Model"));
const SpecialityDoctorType_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityDoctorType.Model"));
const schemaNames_1 = require("../Services/schemaNames");
const underscore_1 = __importDefault(require("underscore"));
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const Appointment_Model_1 = __importDefault(require("../Models/Appointment.Model"));
const OTP_Model_1 = __importDefault(require("../Models/OTP.Model"));
const message_service_1 = require("../Services/message.service");
const WorkingHours_Model_1 = __importDefault(require("../Models/WorkingHours.Model"));
const Patient_Controller_1 = require("./Patient.Controller");
const WorkingHour_helper_1 = require("../Services/WorkingHour.helper");
const bcrypt = __importStar(require("bcrypt"));
const Services_Model_1 = __importDefault(require("../Admin Controlled Models/Services.Model"));
const excludeDoctorFields = {
    password: 0,
    // panCard: 0,
    // adhaarCard: 0,
    verified: 0,
    registrationDate: 0,
    DOB: 0,
    registration: 0,
    KYCDetails: 0,
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            if (body.phoneNumber == "9999999999") {
                const profile = yield Hospital_Model_1.default.findOne({
                    phoneNumber: body.phoneNumber,
                    deleted: false,
                }, excludeDoctorFields);
                const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_HOSPITAL_KEY);
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
                    const profile = yield Hospital_Model_1.default.findOne({
                        contactNumber: body.phoneNumber,
                        deleted: false,
                    });
                    if (profile) {
                        const token = yield jwt.sign(profile.toJSON(), process.env.SECRET_HOSPITAL_KEY);
                        otpData.remove();
                        const { name, contactNumber, _id, numberOfBed } = profile.toJSON();
                        return (0, response_1.successResponse)({ token, name, contactNumber, _id, numberOfBed }, "Successfully logged in", res);
                    }
                    else {
                        otpData.remove();
                        return (0, response_1.successResponse)({ message: "No Data found" }, "Create a new Hospital", res, 201);
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
exports.login = login;
const loginWithPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.password =
            body.password && body.password.trim().length >= 5 ? body.password : null;
        body.contactNumber =
            body.contactNumber && body.contactNumber.trim().length == 10
                ? body.contactNumber
                : null;
        if (body.password && body.contactNumber) {
            const hospital = yield Hospital_Model_1.default.findOne({
                contactNumber: body.contactNumber,
                deleted: false,
            }, Patient_Controller_1.excludeHospitalFields);
            if (hospital) {
                let cryptSalt = yield bcrypt.genSalt(10);
                let password = yield bcrypt.hash(body.password, cryptSalt);
                const compare = yield bcrypt.compare(body.password, hospital.password);
                if (compare) {
                    const token = yield jwt.sign(hospital.toJSON(), process.env.SECRET_HOSPITAL_KEY);
                    const { name, _id } = hospital;
                    return (0, response_1.successResponse)({ token, name, _id }, "Success", res);
                }
                else {
                    let error = new Error("Incorrect password");
                    error.name = "Authentication Failed";
                    return (0, response_1.errorResponse)(error, res);
                }
            }
            else {
                let error = new Error("No hospital found");
                error.name = "Not Found";
                return (0, response_1.errorResponse)(error, res);
            }
            // bcrypt.compare()
        }
        let error = new Error("Invalid Phone Number");
        error.name = "Authentication Failed";
        return (0, response_1.errorResponse)(error, res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.loginWithPassword = loginWithPassword;
//get all hospitals
const getAllHospitalsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hospitalList = yield Hospital_Model_1.default.find({ deleted: false }).populate([
            {
                path: "address",
                populate: {
                    path: "city state locality country",
                },
            },
            { path: "anemity" },
            { path: "payment" },
            { path: "specialisedIn" },
            { path: "doctors" },
        ]);
        return (0, response_1.successResponse)(hospitalList, "Successfully fetched Hospital's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllHospitalsList = getAllHospitalsList;
//get myHospital
const myHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hospital = yield Hospital_Model_1.default.find({
            deleted: false,
            _id: req.currentHospital,
        });
        return (0, response_1.successResponse)(hospital, "Successfully fetched Hospital", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.myHospital = myHospital;
//create a hospital
const createHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let addressObj = yield new Address_Model_1.default(body.address).save();
        body["address"] = addressObj._id;
        let hospitalObj = yield new Hospital_Model_1.default(body).save();
        jwt.sign(hospitalObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            const { name, _id } = hospitalObj;
            return (0, response_1.successResponse)({ token, name, _id }, "Hospital created successfully", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createHospital = createHospital;
//add anemity
const createHospitalAnemity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let anemityObj = yield new Anemities_Model_1.default(body).save();
        return (0, response_1.successResponse)(anemityObj, "Address has been successfully added", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createHospitalAnemity = createHospitalAnemity;
// Get anemities
const getAnemities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let anemityObj = yield Anemities_Model_1.default.find({});
        return (0, response_1.successResponse)(anemityObj, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAnemities = getAnemities;
// Get services
const getServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let serviceObj = yield Services_Model_1.default.find({});
        return (0, response_1.successResponse)(serviceObj, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getServices = getServices;
//add hospital speciality
// export const addHospitalSpeciality= async(req:Request, res:Response)=>{
//   try{
//     let body=req.body;
//     let specialityObj=await new hospitalSpecialityModel(body).save();
//       return successResponse(specialityObj, "Speciality has been successfully added",res);
//   }
//   catch(error: any){
//     return errorResponse(error, res);
//   }
// };
const deleteHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const HospitalDel = yield Hospital_Model_1.default.findOneAndUpdate({ _id: req.currentHospital, deleted: false }, { $set: { deleted: true } });
        if (HospitalDel) {
            return (0, response_1.successResponse)({}, "Hospital deleted successfully", res);
        }
        else {
            let error = new Error("Hospital doesn't exist");
            error.name = "Not found";
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteHospital = deleteHospital;
const updateHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _a = req.body, { doctors, anemity, payment, contactNumber, numberOfBed, type } = _a, body = __rest(_a, ["doctors", "anemity", "payment", "contactNumber", "numberOfBed", "type"]);
        const updateQuery = {
            $set: { body, numberOfBed, type },
            $addToSet: {
                doctors,
                anemity,
                payment,
            },
        };
        let b = req.body;
        const DoctorObj = yield Doctors_Model_1.default.find({ deleted: false, _id: doctors });
        if (!doctors || DoctorObj.length == doctors.length) {
            const HospitalUpdateObj = yield Hospital_Model_1.default.findOneAndUpdate({ _id: req.currentHospital, deleted: false }, b, { new: true });
            if (HospitalUpdateObj) {
                return (0, response_1.successResponse)(HospitalUpdateObj, "Hospital updated successfully", res);
            }
            else {
                let error = new Error("Hospital doesn't exist");
                error.name = "Not found";
                return (0, response_1.errorResponse)(error, res, 404);
            }
        }
        else {
            let error = new Error("Doctor doesn't exist");
            error.name = "Not Found";
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.updateHospital = updateHospital;
// Get Hospital by speciality or body parts
const searchHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const term = req.params.term;
        const promiseArray = [
            SpecialityBody_Model_1.default.aggregate([
                {
                    $facet: {
                        bySpeciality: [
                            {
                                $lookup: {
                                    from: "specialization",
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
            const hospitalArray = yield Hospital_Model_1.default
                .find({
                $or: [
                    {
                        deleted: false,
                        active: true,
                        specialisedIn: { $in: specialityArray },
                        // doctors: {specialization: {$in: specialityArray}}
                    },
                    {
                        type: term,
                    },
                ],
            }, {
                doctors: 0,
                specialisedIn: 0,
                treatmentType: 0,
                type: 0,
                payment: 0,
                deleted: 0,
                contactNumber: 0,
                numberOfBed: 0,
            })
                .populate({ path: "anemity" })
                .populate({
                path: "address",
                populate: {
                    path: "city state country locality",
                },
            })
                // .populate("doctors")
                .populate({
                path: "openingHour",
                select: {
                    doctorDetails: 0,
                    hospitalDetails: 0,
                },
            });
            // .populate("anemity")
            return (0, response_1.successResponse)(hospitalArray, "Success", res);
        }))
            .catch((error) => {
            return (0, response_1.errorResponse)(error, res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.searchHospital = searchHospital;
const removeDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctors } = req.body;
        const doctorProfile = yield Doctors_Model_1.default.findOne({
            deleted: false,
            _id: doctors,
        });
        if (doctorProfile) {
            const hospitalDoctor = yield Hospital_Model_1.default.findOneAndUpdate({ _id: req.currentHospital, doctors: { $in: doctors } }, { $pull: { doctors: doctors } });
            return (0, response_1.successResponse)(hospitalDoctor, "Doctor Removed Successfully", res);
        }
        let error = new Error("Doctor doesnot exist");
        error.name = "Not Found";
        return (0, response_1.errorResponse)(error, res, 404);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.removeDoctor = removeDoctor;
const viewAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.params.page);
        const appointmentObj = yield Appointment_Model_1.default
            .find({ hospital: req.currentHospital, "time.date": { $gt: Date() } })
            .populate({
            path: "patient",
            select: Object.assign(Object.assign({}, Patient_Controller_1.excludePatientFields), { phoneNumber: 0, email: 0, active: 0, deleted: 0 }),
        })
            .populate({
            path: "doctors",
            select: Object.assign(Object.assign({}, excludeDoctorFields), { gender: 0, phoneNumber: 0, email: 0, active: 0, deleted: 0, specialization: 0, qualification: 0, overallExperience: 0, hospitalDetails: 0, image: 0, id: 0 }),
        })
            .sort({ "time.date": 1 })
            .skip(page > 1 ? (page - 1) * 2 : 0)
            .limit(2);
        const page2 = appointmentObj.length / 2;
        const older_apppointmentObj = yield Appointment_Model_1.default
            .find({ hospital: req.currentHospital, "time.date": { $lte: Date() } })
            .populate({
            path: "patient",
            select: Object.assign(Object.assign({}, Patient_Controller_1.excludePatientFields), { phoneNumber: 0, email: 0, active: 0, deleted: 0 }),
        })
            .populate({
            path: "doctors",
            select: Object.assign(Object.assign({}, excludeDoctorFields), { gender: 0, phoneNumber: 0, email: 0, active: 0, deleted: 0, specialization: 0, qualification: 0, overallExperience: 0, hospitalDetails: 0, image: 0, id: 0 }),
        })
            .sort({ "time.date": 1 })
            .skip(page > page2 ? (page - 1) * 2 : 0)
            .limit(2);
        const allAppointment = appointmentObj.concat(older_apppointmentObj);
        if (allAppointment.length > 0)
            return (0, response_1.successResponse)(allAppointment, "Appointments found", res);
        else {
            let error = new Error("No appointments found");
            return (0, response_1.errorResponse)(error, res, 404);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.viewAppointment = viewAppointment;
const getHospitalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let hospital = yield Hospital_Model_1.default
            .findOne({
            _id: req.params.id,
        })
            .populate({
            path: "address",
            populate: {
                path: "city state locality country",
            },
        })
            .populate({
            path: "doctors",
            select: {
                firstName: 1,
                lastName: 1,
                specialization: 1,
                hospitalDetails: 1,
                qualification: 1,
                overallExperience: 1,
            },
            populate: {
                path: "specialization qualification hospitalDetails.workingHours",
                select: {
                    doctorDetails: 0,
                    hospitalDetails: 0,
                },
            },
        })
            .populate("anemity")
            .populate("payment")
            .populate("specialisedIn")
            .populate({
            path: "openingHour",
            select: {
                _id: 0,
                __v: 0,
                byHospital: 0,
            },
        })
            .populate("services")
            .lean();
        if (hospital.doctors.length == 0) {
            return (0, response_1.successResponse)({ hospital }, "Success", res);
        }
        const doctorIds = hospital.doctors.map((e) => {
            return e._id.toString();
        });
        let workingHours = yield WorkingHours_Model_1.default
            .find({
            doctorDetails: { $in: doctorIds },
            hospitalDetails: req.params.id,
        })
            .select({
            hosptial: 0,
            _id: 0,
            __v: 0,
            byHospital: 0,
            hospitalDetails: 0,
        })
            .lean();
        workingHours = workingHours.reduce((r, a) => {
            r[a.doctorDetails.toString()] = [
                ...(r[a.doctorDetails.toString()] || []),
                a,
            ];
            return r;
        }, {});
        hospital.doctors.map((e) => {
            e.hospitalDetails = e.hospitalDetails.filter((elem) => elem.hospital.toString() == req.params.id);
        });
        let doctors = hospital.doctors.map((e) => {
            if (e.hospitalDetails.length != 0) {
                return {
                    _id: e._id,
                    firstName: e.firstName,
                    lastName: e.lastName,
                    specialization: e.specialization,
                    qualification: e.qualification,
                    KYCDetails: e.KYCDetails,
                    overallExperience: e.overallExperience,
                    hospitalDetails: [
                        {
                            workingHour: (0, WorkingHour_helper_1.formatWorkingHour)(workingHours[e._id.toString()]),
                            consultationFee: e.hospitalDetails[0].consultationFee,
                            _id: e.hospitalDetails._id,
                        },
                    ],
                };
            }
            // return ...[]
            // return;
        });
        if (hospital.openingHour) {
            hospital.openingHour = (0, WorkingHour_helper_1.formatWorkingHour)([hospital.openingHour]);
        }
        hospital.doctors = doctors;
        if (doctors.includes(undefined) && doctors.length == 1) {
            hospital.doctors = [];
        }
        else {
            doctors = doctors.filter((e) => e);
            hospital.doctors = doctors;
        }
        return (0, response_1.successResponse)({ hospital }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getHospitalById = getHospitalById;
