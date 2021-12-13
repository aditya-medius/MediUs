"use strict";
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
exports.addAddress = exports.addCountry = exports.addLocality = exports.addState = exports.addCity = exports.addHospitalSpeciality = exports.createHospitalAnemity = exports.addToSpecialityBody = exports.addSpecialityBody = exports.addBodyPart = exports.addSpeciality = void 0;
const BodyPart_Model_1 = __importDefault(require("../Admin Controlled Models/BodyPart.Model"));
const SpecialityBody_Model_1 = __importDefault(require("../Admin Controlled Models/SpecialityBody.Model"));
const Specialization_Model_1 = __importDefault(require("../Admin Controlled Models/Specialization.Model"));
const Anemities_Model_1 = __importDefault(require("../Models/Anemities.Model"));
const response_1 = require("../Services/response");
const addSpeciality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const data = yield new Specialization_Model_1.default(body).save();
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addSpeciality = addSpeciality;
const addBodyPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const data = yield new BodyPart_Model_1.default(body).save();
        return (0, response_1.successResponse)(data, "Successfully created data", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addBodyPart = addBodyPart;
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
//add anemity
const createHospitalAnemity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let anemityObj = yield new Anemities_Model_1.default(body).save();
        return (0, response_1.successResponse)(anemityObj, "Address has been successfully added", res);
    }
    finally {
    }
});
exports.createHospitalAnemity = createHospitalAnemity;
try {
}
catch (error) {
    return (0, response_1.errorResponse)(error, res);
}
;
const addHospitalSpeciality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let specialityObj = yield new hospitalSpecialityModel(body).save();
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
        let cityObj = yield new cityModel(body).save();
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
        let stateObj = yield new stateModel(body).save();
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
        let localityObj = yield new LocalityModel(body).save();
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
        let countryObj = yield new countryModel(body).save();
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
        let addressObj = yield new addressModel(body).save();
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
