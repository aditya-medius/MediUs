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
exports.getAllFeedbacks = exports.submitFeedback = void 0;
const Feedback_Model_1 = __importDefault(require("../Models/Feedback.Model"));
const response_1 = require("../Services/response");
const schemaNames_1 = require("../Services/schemaNames");
const Doctor_Controller_1 = require("./Doctor.Controller");
const Patient_Controller_1 = require("./Patient.Controller");
const submitFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let InModel = "";
        if (req.currentDoctor) {
            InModel = schemaNames_1.doctor;
        }
        else if (req.currentHospital) {
            InModel = schemaNames_1.hospital;
        }
        else if (req.currentPatient) {
            InModel = schemaNames_1.patient;
        }
        body.InModel = InModel;
        const feedbackObj = yield new Feedback_Model_1.default(body).save();
        return (0, response_1.successResponse)(feedbackObj, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.submitFeedback = submitFeedback;
const getAllFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let select;
        if (req.currentDoctor) {
            select = Doctor_Controller_1.excludeDoctorFields;
        }
        else if (req.currentHospital) {
            select = Patient_Controller_1.excludeHospitalFields;
        }
        else if (req.currentPatient) {
            select = Patient_Controller_1.excludePatientFields;
        }
        const feedbackObj = yield Feedback_Model_1.default.find({}).populate({
            path: "userId",
            select,
        });
        // const feedbackObj = await feedbackModel.find({ InModel });
        return (0, response_1.successResponse)(feedbackObj, "Succes", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getAllFeedbacks = getAllFeedbacks;
