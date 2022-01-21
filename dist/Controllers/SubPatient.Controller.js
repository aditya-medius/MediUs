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
exports.updateSubPatient = exports.getSubPatientById = exports.deleteSubPatient = exports.getSubPatientList = exports.addSubPatient = void 0;
const response_1 = require("../Services/response");
const SubPatient_Model_1 = __importDefault(require("../Models/SubPatient.Model"));
const addSubPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.parentPatient = req.currentPatient;
        const subPatient = yield new SubPatient_Model_1.default(body).save();
        return (0, response_1.successResponse)(subPatient, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addSubPatient = addSubPatient;
const getSubPatientList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subPatientList = yield SubPatient_Model_1.default.find({
            parentPatient: req.currentPatient,
            deleted: false,
        });
        return (0, response_1.successResponse)(subPatientList, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getSubPatientList = getSubPatientList;
const deleteSubPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedSubPatient = yield SubPatient_Model_1.default.findOneAndUpdate({
            _id: req.params.id,
        }, {
            $set: {
                deleted: true,
            },
        });
        if (deletedSubPatient) {
            return (0, response_1.successResponse)(deletedSubPatient, "Successfully deleted patient", res);
        }
        else {
            return (0, response_1.successResponse)({}, "No patient found", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.deleteSubPatient = deleteSubPatient;
const getSubPatientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subPatientObj = yield SubPatient_Model_1.default.findOne({
            _id: req.params.id,
            deleted: false,
        });
        if (subPatientObj) {
            return (0, response_1.successResponse)(subPatientObj, "Success", res);
        }
        else {
            return (0, response_1.successResponse)({}, "No patient found", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getSubPatientById = getSubPatientById;
const updateSubPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        if ("gender" in body) {
            if (!["Male", "Female", "Other"].includes(body.gender)) {
                let error = new Error("Invalid gender");
                error.name = "Gender is invalid";
                return (0, response_1.errorResponse)(error, res);
            }
        }
        const subPatientObj = yield SubPatient_Model_1.default.findOneAndUpdate({ _id: req.params.id }, {
            $set: Object.assign({}, body),
        }, {
            new: true,
        });
        if (subPatientObj) {
            return (0, response_1.successResponse)(subPatientObj, "Success", res);
        }
        else {
            return (0, response_1.successResponse)({}, "No Data Found", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.updateSubPatient = updateSubPatient;
