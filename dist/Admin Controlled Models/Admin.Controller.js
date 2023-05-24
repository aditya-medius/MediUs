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
exports.getDoctorById = exports.getHospitalById = exports.editFee = exports.editSpeciality = exports.deleteOwnership = exports.getOwnership = exports.addOwnership = exports.getFees = exports.createFee = exports.getAllAppointments = exports.addQualificationn = exports.uploadCSV_locality = exports.uploadCSV_city = exports.uploadCSV_state = exports.getLocalityByCity = exports.getCityByState = exports.getStateByCountry = exports.setCityMap = exports.setStateMap = exports.setCountryMap = exports.getAllHospitalList = exports.getAllSuvedhaList = exports.getAllAgentList = exports.getAllPatientList = exports.verifyAgents = exports.getAllDoctorsList = exports.verifyHospitals = exports.verifyDoctors = exports.getUnverifiedDoctors = exports.deleteHospitalService = exports.addHospitalService = exports.create = exports.login = exports.getCityStateLocalityCountry = exports.getPayments = exports.addPayment = exports.addCountry = exports.addLocality = exports.addState = exports.addCity = exports.addToSpecialityDoctorType = exports.addSpecialityDoctorType = exports.addDoctorType = exports.addToSpecialityDisease = exports.addSpecialityDisease = exports.addDisease = exports.addToSpecialityBody = exports.addSpecialityBody = exports.addBodyPart = exports.addSpeciality = void 0;
const BodyPart_Model_1 = __importDefault(require("./BodyPart.Model"));
const SpecialityBody_Model_1 = __importDefault(require("./SpecialityBody.Model"));
const SpecialityDisease_Model_1 = __importDefault(require("./SpecialityDisease.Model"));
const Specialization_Model_1 = __importDefault(require("./Specialization.Model"));
const City_Model_1 = __importDefault(require("./City.Model"));
const State_Model_1 = __importDefault(require("./State.Model"));
const Country_Model_1 = __importDefault(require("./Country.Model"));
const response_1 = require("../Services/response");
const Locality_Model_1 = __importDefault(require("./Locality.Model"));
const Disease_Model_1 = __importDefault(require("./Disease.Model"));
const DoctorType_Model_1 = __importDefault(require("./DoctorType.Model"));
const SpecialityDoctorType_Model_1 = __importDefault(require("./SpecialityDoctorType.Model"));
const Payment_Model_1 = __importDefault(require("./Payment.Model"));
const Admin_Model_1 = __importDefault(require("./Admin.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const Services_Model_1 = __importDefault(require("./Services.Model"));
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const Doctor_Controller_1 = require("../Controllers/Doctor.Controller");
const Agent_Model_1 = __importDefault(require("../Models/Agent.Model"));
const adminService = __importStar(require("../Services/Admin/Admin.Service"));
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
const Appointment_Model_1 = __importDefault(require("../Models/Appointment.Model"));
const feeService = __importStar(require("../Module/Payment/Service/Fee.Service"));
const ownershipService = __importStar(require("../Services/Ownership/Ownership.Service"));
const addSpeciality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let exist = yield Specialization_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("Speciality already exist"), res);
        }
        const data = yield new Specialization_Model_1.default(body).save();
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addSpeciality = addSpeciality;
/*
  Body parts - START
*/
// Add body part
const addBodyPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let exist = yield BodyPart_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("Body Part already exist"), res);
        }
        const data = yield new BodyPart_Model_1.default(body).save();
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addBodyPart = addBodyPart;
// Add Speciality and body record
const addSpecialityBody = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.bodyParts = [...new Set(body.bodyParts)];
        const data = yield new SpecialityBody_Model_1.default({
            speciality: body.speciality,
            bodyParts: body.bodyParts,
        }).save();
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addSpecialityBody = addSpecialityBody;
// Update speciality Body Model
const addToSpecialityBody = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.bodyParts = [...new Set(body.bodyParts)];
        const data = yield SpecialityBody_Model_1.default.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { bodyParts: body.bodyParts } }, { new: true });
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addToSpecialityBody = addToSpecialityBody;
/*
  Body Part - END
*/
/*
  Disease - START
*/
// Add disease
const addDisease = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let exist = yield Disease_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("Disease already exist"), res);
        }
        const data = yield new Disease_Model_1.default(body).save();
        return (0, response_1.successResponse)(data, "Successfully added disease", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addDisease = addDisease;
// Add Speciality and Disease record
const addSpecialityDisease = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.disease = [...new Set(body.disease)];
        const data = yield new SpecialityDisease_Model_1.default({
            speciality: body.speciality,
            disease: body.disease,
        }).save();
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addSpecialityDisease = addSpecialityDisease;
// Update speciality Body Model
const addToSpecialityDisease = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.disease = [...new Set(body.disease)];
        const data = yield SpecialityDisease_Model_1.default.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { disease: body.disease } }, { new: true });
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addToSpecialityDisease = addToSpecialityDisease;
/*
  Disease - END
*/
/*
  Doctor Type - START
*/
// Add Doctor Type
const addDoctorType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let exist = yield DoctorType_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("Doctor Type already exist"), res);
        }
        const data = yield new DoctorType_Model_1.default(body).save();
        return (0, response_1.successResponse)(data, "Successfully added doctor type", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addDoctorType = addDoctorType;
// Add Speciality and Doctor type record
const addSpecialityDoctorType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.doctorType = [...new Set(body.doctorType)];
        const data = yield new SpecialityDoctorType_Model_1.default({
            speciality: body.speciality,
            doctorType: body.doctorType,
        }).save();
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addSpecialityDoctorType = addSpecialityDoctorType;
// Update speciality Body Model
const addToSpecialityDoctorType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.doctorType = [...new Set(body.doctorType)];
        const data = yield SpecialityDoctorType_Model_1.default.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { doctorType: body.doctorType } }, { new: true });
        return (0, response_1.successResponse)(data, "Successfully updated data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addToSpecialityDoctorType = addToSpecialityDoctorType;
/*
  Doctor Type - END
*/
//add city
const addCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let exist = yield City_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("City already exist"), res);
        }
        let cityObj = yield new City_Model_1.default(body).save();
        cityObj["city-id"] = cityObj._id;
        cityObj.save();
        return (0, response_1.successResponse)(cityObj, "City has been successfully added", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addCity = addCity;
//add state
const addState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let exist = yield State_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("State already exist"), res);
        }
        let stateObj = yield new State_Model_1.default(body).save();
        return (0, response_1.successResponse)(stateObj, "State has been successfully added", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addState = addState;
//add locality
const addLocality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let exist = yield Locality_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("Locality already exist"), res);
        }
        let localityObj = yield new Locality_Model_1.default(body).save();
        localityObj["localityid"] = localityObj._id;
        localityObj.save();
        return (0, response_1.successResponse)(localityObj, "Locality has been successfully added", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addLocality = addLocality;
//add country
const addCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let exist = yield Country_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("Country already exist"), res);
        }
        let countryObj = yield new Country_Model_1.default(body).save();
        return (0, response_1.successResponse)(countryObj, "Country has been successfully added", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addCountry = addCountry;
//add payment options
const addPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let paymentObj = yield new Payment_Model_1.default(body).save();
        return (0, response_1.successResponse)(paymentObj, "Payment Options has been successfully added", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addPayment = addPayment;
// get payment options
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let paymentObj = yield Payment_Model_1.default.find({});
        return (0, response_1.successResponse)(paymentObj, "Success", res);
    }
    catch (error) { }
});
exports.getPayments = getPayments;
// Get cities, states, locality and country
const getCityStateLocalityCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page = 0, limit = 20 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const city = yield City_Model_1.default.find();
        const state = yield State_Model_1.default.find();
        const locality = yield Locality_Model_1.default.find()
            .skip(limit * page)
            .limit(limit);
        const localityCount = yield Locality_Model_1.default.count();
        const country = yield Country_Model_1.default.find();
        const [Ci, S, L, Co] = yield Promise.all([city, state, locality, country]);
        let response = {};
        let { region } = req.query;
        if (region) {
            region = region.toLowerCase();
            if (region === "city") {
                response[region] = Ci;
            }
            else if (region === "state") {
                response[region] = S;
            }
            else if (region === "locality") {
                response[region] = L;
                response["count"] = localityCount;
            }
            else if (region === "country") {
                response[region] = Co;
            }
        }
        else {
            // response = { city: Ci, state: S, locality: L, country: Co };
            response = { state: S };
        }
        return (0, response_1.successResponse)(Object.assign({}, response), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getCityStateLocalityCountry = getCityStateLocalityCountry;
// export const login = async (req: Request, res: Response) => {
//   try {
//     let body: any = req.query;
//     if (!("OTP" in body)) {
//       if (/^[0]?[6789]\d{9}$/.test(body.phoneNumber)) {
//         const OTP = Math.floor(100000 + Math.random() * 900000).toString();
//         // Implement message service API
//         sendMessage(`Your OTP is: ${OTP}`, body.phoneNumber)
//           .then(async (message: any) => {
//             const otpToken = jwt.sign(
//               { otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 },
//               OTP
//             );
//             // Add OTP and phone number to temporary collection
//             await otpModel.findOneAndUpdate(
//               { phoneNumber: body.phoneNumber },
//               { $set: { phoneNumber: body.phoneNumber, otp: otpToken } },
//               { upsert: true }
//             );
//           })
//           .catch((error) => {
//             throw error;
//           });
//         return successResponse({}, "OTP sent successfully", res);
//       } else {
//         let error = new Error("Invalid phone number");
//         error.name = "Invalid input";
//         return errorResponse(error, res);
//       }
//     } else {
//       const otpData = await otpModel.findOne({
//         phoneNumber: body.phoneNumber,
//       });
//       try {
//         const data: any = await jwt.verify(otpData.otp, body.OTP);
//         if (Date.now() > data.expiresIn)
//           return errorResponse(new Error("OTP expired"), res);
//         if (body.OTP === data.otp) {
//           const profile = await adminModel.findOne({
//             phoneNumber: body.phoneNumber,
//           });
//           if (profile) {
//             const token = await jwt.sign(
//               profile.toJSON(),
//               process.env.SECRET_ADMIN_KEY as string
//             );
//             otpData.remove();
//             return successResponse(token, "Successfully logged in", res);
//           } else {
//             otpData.remove();
//             return successResponse(
//               { message: "No Data found" },
//               "Create a new profile",
//               res,
//               201
//             );
//           }
//         } else {
//           const error = new Error("Invalid OTP");
//           error.name = "Invalid";
//           return errorResponse(error, res);
//         }
//       } catch (err) {
//         if (err instanceof jwt.JsonWebTokenError) {
//           const error = new Error("OTP isn't valid");
//           error.name = "Invalid OTP";
//           return errorResponse(error, res);
//         }
//         return errorResponse(err, res);
//       }
//     }
//   } catch (error: any) {
//     return errorResponse(error, res);
//   }
// };
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.query;
        const profile = yield Admin_Model_1.default.findOne({
            phoneNumber: body.phoneNumber,
        });
        let compRes = yield bcrypt.compare(body.password, profile.password);
        if (compRes) {
            let token = yield adminService.getAdminToken(profile.toObject());
            return (0, response_1.successResponse)(token, "Success", res);
        }
        else {
            return (0, response_1.errorResponse)(new Error("Invalid password"), res, 400);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.login = login;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let cryptSalt = yield bcrypt.genSalt(10);
        body.password = yield bcrypt.hash(body.password, cryptSalt);
        let adminObj = yield new Admin_Model_1.default(body).save();
        jwt.sign(adminObj.toJSON(), process.env.SECRET_ADMIN_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Admin profile successfully created", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.create = create;
// Service Controller
const addHospitalService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let exist = yield Services_Model_1.default.exists(body);
        if (exist) {
            return (0, response_1.errorResponse)(new Error("Service already exist"), res);
        }
        let serviceObj = yield new Services_Model_1.default(body).save();
        return (0, response_1.successResponse)(serviceObj, "Successfully created services", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addHospitalService = addHospitalService;
const deleteHospitalService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, response_1.successResponse)(yield Services_Model_1.default.findOneAndDelete({ _id: req.params.id }), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteHospitalService = deleteHospitalService;
// Unverified users ko get krne ki query
const getUnverifiedDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        const unverifiedDoctors = yield Doctors_Model_1.default.find({
            verified: false,
            adminSearch: true,
        });
        return (0, response_1.successResponse)(unverifiedDoctors, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getUnverifiedDoctors = getUnverifiedDoctors;
const verifyDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.params;
        const doctorObj = yield Doctors_Model_1.default.findOneAndUpdate({
            _id: body.doctorId,
            deleted: false,
            // verified: false,
            adminSearch: true,
        }, {
            $set: {
                verified: true,
            },
        });
        if (doctorObj.verified) {
            throw new Error("Doctor is already verified");
        }
        else {
            return (0, response_1.successResponse)({}, "Successfully verified", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.verifyDoctors = verifyDoctors;
const verifyHospitals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.params;
        const hospitalObj = yield Hospital_Model_1.default.findOneAndUpdate({
            _id: body.hospitalId,
            deleted: false,
            // verified: false,
            adminSearch: true,
        }, {
            $set: {
                verified: true,
            },
        });
        if (hospitalObj.verified) {
            throw new Error("Hospital is already verified");
        }
        else {
            return (0, response_1.successResponse)({}, "Successfully verified", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.verifyHospitals = verifyHospitals;
const getAllDoctorsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const doctorList = await doctorModel.find(
        //   {
        //     deleted: false,
        //     adminSearch: true,
        //   },
        //   excludeDoctorFields
        // ).populate("specialization")
        const doctorList = yield Doctors_Model_1.default.aggregate([
            {
                $lookup: {
                    from: "appointments",
                    let: {
                        id: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$doctors", "$$id"],
                                },
                            },
                        },
                        {
                            $count: "appointment",
                        },
                    ],
                    as: "appointment",
                },
            },
            {
                $lookup: {
                    from: "specializations",
                    localField: "specialization",
                    foreignField: "_id",
                    as: "specialization",
                },
            },
            {
                $addFields: {
                    overallExperience: {
                        $function: {
                            body: function (dob) {
                                dob = new Date(dob);
                                var currentDate = new Date();
                                var age = currentDate.getFullYear() - dob.getFullYear();
                                if (age > 0) {
                                    age = `${age} years`;
                                }
                                else {
                                    age = `${age} months`;
                                }
                                return age;
                            },
                            args: ["$overallExperience"],
                            lang: "js",
                        },
                    },
                },
            },
        ]);
        return (0, response_1.successResponse)(doctorList, "Successfully fetched doctor's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllDoctorsList = getAllDoctorsList;
const verifyAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.params;
        const agentObject = yield Agent_Model_1.default.findOneAndUpdate({
            _id: body.agentId,
            deleted: false,
            // verified: false,
            adminSearch: true,
        }, {
            $set: {
                verified: true,
            },
        });
        if (agentObject.verified) {
            throw new Error("Agent is already verified");
        }
        else {
            return (0, response_1.successResponse)({}, "Successfully verified", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.verifyAgents = verifyAgents;
const getAllPatientList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientList = yield Patient_Model_1.default.find({});
        return (0, response_1.successResponse)(patientList, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllPatientList = getAllPatientList;
const getAllAgentList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentList = yield Agent_Model_1.default.find({
            "delData.deleted": false,
            adminSearch: true,
        });
        return (0, response_1.successResponse)(agentList, "Successfully fetched Agent's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllAgentList = getAllAgentList;
const getAllSuvedhaList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suvedhaList = yield Suvedha_Model_1.default
            .find({
            deleted: false,
        })
            .populate({ path: "address", populate: "city locality state" });
        return (0, response_1.successResponse)(suvedhaList, "Successfully fetched Agent's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllSuvedhaList = getAllSuvedhaList;
const getAllHospitalList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const hospitalList = await hospitalModel.find({
        //   "delData.deleted": false,
        //   adminSearch: true,
        // });
        const hospitalList = yield Hospital_Model_1.default.aggregate([
            {
                $lookup: {
                    from: "addresses",
                    localField: "address",
                    foreignField: "_id",
                    as: "address",
                },
            },
            {
                $unwind: {
                    path: "$address",
                },
            },
            {
                $lookup: {
                    from: "appointments",
                    let: {
                        id: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$hospital", "$$id"],
                                },
                            },
                        },
                        {
                            $count: "appointment",
                        },
                    ],
                    as: "appointment",
                },
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "address.city",
                    foreignField: "_id",
                    as: "address.city",
                },
            },
            {
                $unwind: {
                    path: "$address.city",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "address.state",
                    foreignField: "_id",
                    as: "address.state",
                },
            },
            {
                $unwind: {
                    path: "$address.state",
                },
            },
            {
                $lookup: {
                    from: "localities",
                    localField: "address.locality",
                    foreignField: "_id",
                    as: "address.locality",
                },
            },
            {
                $unwind: {
                    path: "$address.locality",
                },
            },
        ]);
        return (0, response_1.successResponse)(hospitalList, "Successfully fetched Hospital's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllHospitalList = getAllHospitalList;
/*
 Country, State, City ki mapping
*/
const Country_Map_Model_1 = __importDefault(require("../Admin Controlled Models/Country.Map.Model"));
const State_Map_Model_1 = __importDefault(require("../Admin Controlled Models/State.Map.Model"));
const City_Map_Model_1 = __importDefault(require("../Admin Controlled Models/City.Map.Model"));
const QualificationName_Model_1 = __importDefault(require("./QualificationName.Model"));
const Suvedha_Model_1 = __importDefault(require("../Models/Suvedha.Model"));
const Fee_Model_1 = __importDefault(require("../Module/Payment/Model/Fee.Model"));
const setCountryMap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let countryMap = yield adminService.checkIfMapExist({
            country: body.country,
            state: { $in: body.state },
        }, Country_Map_Model_1.default);
        if (typeof countryMap === "boolean" && countryMap === true) {
            return (0, response_1.errorResponse)(new Error("Country-State map already exist"), res);
        }
        body.state = countryMap;
        let map = yield adminService.createCountryMap(body);
        return (0, response_1.successResponse)(map, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setCountryMap = setCountryMap;
const setStateMap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let stateMap = yield adminService.checkIfMapExist({
            state: body.state,
            city: { $in: body.city },
        }, State_Map_Model_1.default);
        if (typeof stateMap === "boolean" && stateMap === true) {
            return (0, response_1.errorResponse)(new Error("State-City Map already exist"), res);
        }
        body.city = stateMap;
        let map = yield adminService.createStateMap(body);
        return (0, response_1.successResponse)(map, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setStateMap = setStateMap;
const setCityMap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let cityMap = yield adminService.checkIfMapExist({
            city: body.city,
            locality: { $in: body.locality },
        }, City_Map_Model_1.default);
        if (typeof cityMap === "boolean" && cityMap === true) {
            return (0, response_1.errorResponse)(new Error("City-Locality Map already exist"), res);
        }
        body.locality = cityMap;
        let map = yield adminService.createCityMap(body);
        return (0, response_1.successResponse)(map, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.setCityMap = setCityMap;
const getStateByCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let list = yield adminService.getStateByCountry(req.body);
        return (0, response_1.successResponse)(list, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getStateByCountry = getStateByCountry;
const getCityByState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let list = yield adminService.getCityByState(req.body);
        return (0, response_1.successResponse)(list, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getCityByState = getCityByState;
const getLocalityByCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let list = yield adminService.getLocalityByCity(req.body);
        return (0, response_1.successResponse)(list, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getLocalityByCity = getLocalityByCity;
const uploadCSV_state = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield adminService.handleCSV_state(req.file);
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.uploadCSV_state = uploadCSV_state;
const uploadCSV_city = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield adminService.handleCSV_city(req.file);
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.uploadCSV_city = uploadCSV_city;
const uploadCSV_locality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield adminService.handleCSV_locality(req.file);
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.uploadCSV_locality = uploadCSV_locality;
/* Qualification add kro */
const addQualificationn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let data = yield new QualificationName_Model_1.default(body).save();
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addQualificationn = addQualificationn;
const getAllAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appointments = yield Appointment_Model_1.default
            .find()
            .populate({
            path: "patient",
        })
            .populate({
            path: "doctors",
            select: Doctor_Controller_1.excludeDoctorFields,
            populate: "specialization",
        })
            .populate({
            path: "hospital",
        })
            .populate({
            path: "subPatient",
        })
            .sort({ createdAt: -1 });
        return (0, response_1.successResponse)(appointments, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllAppointments = getAllAppointments;
const createFee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, feeAmount } = req.body;
        let data = yield feeService.setFee(name, feeAmount);
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createFee = createFee;
const getFees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, response_1.successResponse)(yield feeService.getAllFees(), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getFees = getFees;
const addOwnership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ownershipData = yield ownershipService.addOwnership(req.body);
        return (0, response_1.successResponse)(ownershipData, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addOwnership = addOwnership;
const getOwnership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ownershipData = yield ownershipService.getOwnership();
        return (0, response_1.successResponse)(ownershipData, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getOwnership = getOwnership;
const deleteOwnership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, response_1.successResponse)(yield ownershipService.deleteOwnership(req.params.id), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteOwnership = deleteOwnership;
const editSpeciality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { specialityId } = req.body;
        let exist = yield Specialization_Model_1.default.exists({ _id: specialityId });
        if (!exist) {
            return (0, response_1.errorResponse)(new Error("Speciality doesn't exist"), res);
        }
        let { image, name } = req.body;
        let data = yield Specialization_Model_1.default.findOneAndUpdate({ _id: specialityId }, {
            $set: Object.assign(Object.assign({}, (image && { image })), (name && { specialityName: name })),
        });
        return (0, response_1.successResponse)({ success: true }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.editSpeciality = editSpeciality;
const editFee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feeId, name, amount } = req.body;
        let exist = yield Fee_Model_1.default.exists({ _id: feeId });
        if (!exist) {
            return (0, response_1.errorResponse)(new Error("Fee doesn't exist"), res);
        }
        Fee_Model_1.default
            .findOneAndUpdate({
            _id: feeId,
        }, {
            $set: Object.assign(Object.assign({}, (amount && { feeAmount: amount })), (name && { name })),
        })
            .then((result) => {
            console.log("dsjgfdvsdds", result);
        });
        return (0, response_1.successResponse)({ success: true }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.editFee = editFee;
const getHospitalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hospital = yield Hospital_Model_1.default
            .findOne({ _id: req.params.id }, "-password ")
            .populate("doctors anemity services")
            .populate({
            path: "address",
            populate: "city locality",
        });
        return (0, response_1.successResponse)(hospital, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getHospitalById = getHospitalById;
const getDoctorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = yield Doctors_Model_1.default.findOne({ _id: req.params.id }, "-password");
        return (0, response_1.successResponse)(doctor, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorById = getDoctorById;
