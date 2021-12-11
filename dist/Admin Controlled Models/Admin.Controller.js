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

exports.addCountry = exports.addLocality = exports.addState = exports.addCity = exports.addToSpecialityDoctorType = exports.addSpecialityDoctorType = exports.addDoctorType = exports.addToSpecialityDisease = exports.addSpecialityDisease = exports.addDisease = exports.addToSpecialityBody = exports.addSpecialityBody = exports.addBodyPart = exports.addSpeciality = void 0;

exports.addPayment = exports.addCountry = exports.addLocality = exports.addState = exports.addCity = exports.addToSpecialityBody = exports.addSpecialityBody = exports.addBodyPart = exports.addSpeciality = void 0;

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
/*
  Body parts - START
*/
// Add body part
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
        let cityObj = yield new City_Model_1.default(body).save();
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
        let localityObj = yield new Locality_Model_1.default(body).save();
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
