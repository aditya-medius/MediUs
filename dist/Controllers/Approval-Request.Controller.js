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
Object.defineProperty(exports, "__esModule", { value: true });
exports.denyDoctorRequest = exports.approveDoctorRequest = exports.requestApprovalFromHospital = exports.denyHospitalRequest = exports.approveHospitalRequest = exports.requestApprovalFromDoctor = void 0;
const approvalService = __importStar(require("../Services/Approval-Request/Approval-Request.Service"));
const response_1 = require("../Services/response");
const requestApprovalFromDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId, hospitalId } = req.body;
        let exist = yield approvalService.doctorKLiyeHospitalKiRequestExistKrtiHai(doctorId, hospitalId);
        let response = yield approvalService.requestApprovalFromDoctor(doctorId, hospitalId);
        return (0, response_1.successResponse)(response, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.requestApprovalFromDoctor = requestApprovalFromDoctor;
const approveHospitalRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { requestId } = req.body;
        let requestExist = yield approvalService.canThisDoctorApproveThisRequest(requestId, req.currentDoctor);
        if (requestExist) {
            let response = yield approvalService.approveHospitalRequest(requestId);
            return (0, response_1.successResponse)(response, "Success", res);
        }
        else {
            throw new Error("Either this request does not exist or you are trying to approve someone else's request");
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.approveHospitalRequest = approveHospitalRequest;
const denyHospitalRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { requestId } = req.body;
        let response = yield approvalService.denyHospitalRequest(requestId);
        return (0, response_1.successResponse)(response, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.denyHospitalRequest = denyHospitalRequest;
const requestApprovalFromHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId, hospitalId } = req.body;
        let exist = yield approvalService.hospitalKLiyeDoctorKiRequestExistKrtiHai(doctorId, hospitalId);
        console.log("exit 2:", exist);
        let response = yield approvalService.requestApprovalFromHospital(doctorId, hospitalId);
        return (0, response_1.successResponse)(response, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.requestApprovalFromHospital = requestApprovalFromHospital;
const approveDoctorRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { requestId } = req.body;
        let requestExist = yield approvalService.canThisHospitalApproveThisRequest(requestId, req.currentHospital);
        if (requestExist) {
            let response = yield approvalService.approveDoctorRequest(requestId);
            return (0, response_1.successResponse)(response, "Success", res);
        }
        else {
            throw new Error("Either this request does not exist or you are trying to approve someone else's request");
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.approveDoctorRequest = approveDoctorRequest;
const denyDoctorRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { requestId } = req.body;
        let response = yield approvalService.denyDoctorRequest(requestId);
        return (0, response_1.successResponse)(response, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.denyDoctorRequest = denyDoctorRequest;
