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
exports.addAddress = exports.addCountry = exports.addLocality = exports.addState = exports.addCity = exports.addHospitalSpeciality = exports.createHospitalAnemity = exports.createHospital = exports.getAllHospitalsList = void 0;
const Address_Model_1 = __importDefault(require("../Models/Address.Model"));
const Anemities_Model_1 = __importDefault(require("../Models/Anemities.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const response_1 = require("../Services/response");
const jwt = __importStar(require("jsonwebtoken"));
const HospitalSpeciality_Model_1 = __importDefault(require("../Models/HospitalSpeciality.Model"));
const City_Model_1 = __importDefault(require("../Models/City.Model"));
const State_Model_1 = __importDefault(require("../Models/State.Model"));
const Locality_Model_1 = __importDefault(require("../Models/Locality.Model"));
const Country_Model_1 = __importDefault(require("../Models/Country.Model"));
const getAllHospitalsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hospitalList = yield Hospital_Model_1.default.find({ deleted: false });
        return (0, response_1.successResponse)(hospitalList, "Successfully fetched Hospital's list", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllHospitalsList = getAllHospitalsList;
//create a hospital
const createHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        //  let specialisedObj=await new specialityModel(body).save();
        let hospitalObj = yield new Hospital_Model_1.default(body).save();
        jwt.sign(hospitalObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Hospital created successfully", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createHospital = createHospital;
const createHospitalAnemity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let anemityObj = yield new Anemities_Model_1.default(body).save();
        jwt.sign(anemityObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Address has been successfully added", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createHospitalAnemity = createHospitalAnemity;
const addHospitalSpeciality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let specialityObj = yield new HospitalSpeciality_Model_1.default(body).save();
        jwt.sign(specialityObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Speciality has been successfully added", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addHospitalSpeciality = addHospitalSpeciality;
//add city 
const addCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let cityObj = yield new City_Model_1.default(body).save();
        jwt.sign(cityObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "City has been successfully added", res);
        });
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
        let stateObj = yield new State_Model_1.default(body).save();
        jwt.sign(stateObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "State has been successfully added", res);
        });
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
        let localityObj = yield new Locality_Model_1.default(body).save();
        jwt.sign(localityObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Locality has been successfully added", res);
        });
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
        let countryObj = yield new Country_Model_1.default(body).save();
        jwt.sign(countryObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Country has been successfully added", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addCountry = addCountry;
//add address
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let addressObj = yield new Address_Model_1.default(body).save();
        jwt.sign(addressObj.toJSON(), process.env.SECRET_HOSPITAL_KEY, (err, token) => {
            if (err)
                return (0, response_1.errorResponse)(err, res);
            return (0, response_1.successResponse)(token, "Addresss has been successfully added", res);
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addAddress = addAddress;
