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
exports.checkHospitalsApprovalStatus = exports.checkDoctorsApprovalStatus = exports.denyDoctorRequest = exports.approveDoctorRequest = exports.requestApprovalFromHospital = exports.denyHospitalRequest = exports.approveHospitalRequest = exports.requestApprovalFromDoctor = void 0;
const Approval_Request_Model_1 = __importDefault(require("../../Models/Approval-Request.Model"));
const schemaNames_1 = require("../schemaNames");
const requestApprovalFromDoctor = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let approvalRequest = yield new Approval_Request_Model_1.default({
            /* Kaha se Request aayi hai */
            requestFrom: hospitalId,
            ref_From: schemaNames_1.hospital,
            /* Kiske liye aayi hai */
            requestTo: doctorId,
            ref_To: schemaNames_1.doctor,
        }).save();
        return Promise.resolve(approvalRequest);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.requestApprovalFromDoctor = requestApprovalFromDoctor;
const approveHospitalRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield changeRequestStatus(requestId, "Approved"));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.approveHospitalRequest = approveHospitalRequest;
const denyHospitalRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield changeRequestStatus(requestId, "Denied"));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.denyHospitalRequest = denyHospitalRequest;
const requestApprovalFromHospital = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let approvalRequest = yield new Approval_Request_Model_1.default({
            /* Kaha se Request aayi hai */
            requestFrom: doctorId,
            ref_From: schemaNames_1.doctor,
            /* Kiske liye aayi hai */
            requestTo: hospitalId,
            ref_To: schemaNames_1.hospital,
        }).save();
        return Promise.resolve(approvalRequest);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.requestApprovalFromHospital = requestApprovalFromHospital;
const approveDoctorRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield changeRequestStatus(requestId, "Approved"));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.approveDoctorRequest = approveDoctorRequest;
const denyDoctorRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield changeRequestStatus(requestId, "Denied"));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.denyDoctorRequest = denyDoctorRequest;
/* Doctor ne jo approval ki request ki hai hospital se uska status */
const checkDoctorsApprovalStatus = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let request = yield Approval_Request_Model_1.default.findOne({
            requestFrom: doctorId,
            requestTo: hospitalId,
            "delData.deleted": false,
        });
        if (request) {
            return Promise.resolve(request.approvalStatus);
        }
        else {
            throw new Error("You have no active approval request for this hospital");
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.checkDoctorsApprovalStatus = checkDoctorsApprovalStatus;
/* Hospital ne jo approval ki request ki hai doctor se uska status */
const checkHospitalsApprovalStatus = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let request = yield Approval_Request_Model_1.default.findOne({
            requestTo: doctorId,
            requestFrom: hospitalId,
            "delData.deleted": false,
        });
        if (request) {
            return Promise.resolve(request.approvalStatus);
        }
        else {
            throw new Error("You have no active approval request for this doctor");
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.checkHospitalsApprovalStatus = checkHospitalsApprovalStatus;
const changeRequestStatus = (requestId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Approval_Request_Model_1.default.findOneAndUpdate({ _id: requestId }, { $set: { approvalStatus: status } });
        return Promise.resolve({
            message: `Successfully ${status} the request`,
        });
    }
    catch (error) {
        return Promise.reject(error);
    }
});
