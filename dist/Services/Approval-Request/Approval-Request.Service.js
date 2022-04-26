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
exports.getListOfRequestedApprovals_ByHospital = exports.getListOfRequestedApprovals_OfHospital = exports.getListOfRequestedApprovals_ByDoctor = exports.getListOfRequestedApprovals_OfDoctor = exports.doctorKLiyeHospitalKiRequestExistKrtiHai = exports.hospitalKLiyeDoctorKiRequestExistKrtiHai = exports.canThisHospitalApproveThisRequest = exports.canThisDoctorApproveThisRequest = exports.checkHospitalsApprovalStatus = exports.checkDoctorsApprovalStatus = exports.denyDoctorRequest = exports.approveDoctorRequest = exports.requestApprovalFromHospital = exports.denyHospitalRequest = exports.approveHospitalRequest = exports.requestApprovalFromDoctor = void 0;
const Doctor_Controller_1 = require("../../Controllers/Doctor.Controller");
const Approval_Request_Model_1 = __importDefault(require("../../Models/Approval-Request.Model"));
const Doctors_Model_1 = __importDefault(require("../../Models/Doctors.Model"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
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
        yield changeRequestStatus(requestId, "Approved");
        let request = yield Approval_Request_Model_1.default.findOne({ _id: requestId }, "requestFrom requestTo");
        yield addDoctorAndHospitalToEachOthersProfile(request.requestTo, request.requestFrom);
        // return Promise.resolve(await changeRequestStatus(requestId, "Approved"));
        return Promise.resolve("Success");
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
        yield changeRequestStatus(requestId, "Approved");
        let request = yield Approval_Request_Model_1.default.findOne({ _id: requestId }, "requestFrom requestTo");
        yield addDoctorAndHospitalToEachOthersProfile(request.requestFrom, request.requestTo);
        return Promise.resolve("Success");
        // return Promise.resolve(await changeRequestStatus(requestId, "Approved"));
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
const canThisDoctorApproveThisRequest = (requestId, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestExist = yield Approval_Request_Model_1.default.findOne({
            _id: requestId,
            requestTo: doctorId,
        });
        return Promise.resolve(requestExist);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.canThisDoctorApproveThisRequest = canThisDoctorApproveThisRequest;
const canThisHospitalApproveThisRequest = (requestId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestExist = yield Approval_Request_Model_1.default.findOne({
            _id: requestId,
            requestTo: hospitalId,
        });
        return Promise.resolve(requestExist);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.canThisHospitalApproveThisRequest = canThisHospitalApproveThisRequest;
const hospitalKLiyeDoctorKiRequestExistKrtiHai = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let exist = yield Approval_Request_Model_1.default.exists({
            requestFrom: doctorId,
            requestTo: hospitalId,
            approvalStatus: { $ne: "Approved" },
        });
        if (exist) {
            throw new Error("A request for this already exist. Please wait");
        }
        else {
            return Promise.resolve(true);
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.hospitalKLiyeDoctorKiRequestExistKrtiHai = hospitalKLiyeDoctorKiRequestExistKrtiHai;
const doctorKLiyeHospitalKiRequestExistKrtiHai = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let exist = yield Approval_Request_Model_1.default.exists({
            requestFrom: hospitalId,
            requestTo: doctorId,
            approvalStatus: { $ne: "Approved" },
        });
        if (exist) {
            throw new Error("A request for this already exist. Please wait");
        }
        else {
            return Promise.resolve(true);
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.doctorKLiyeHospitalKiRequestExistKrtiHai = doctorKLiyeHospitalKiRequestExistKrtiHai;
/* Doctor ko kitno ne approval k liye request ki hai */
const getListOfRequestedApprovals_OfDoctor = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let requestedApprovals = yield Approval_Request_Model_1.default.find({
            requestTo: doctorId,
            "delData.deleted": false,
        });
        return Promise.resolve(requestedApprovals);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getListOfRequestedApprovals_OfDoctor = getListOfRequestedApprovals_OfDoctor;
/* Doctor ne kitno se approval ki request ki hai */
const getListOfRequestedApprovals_ByDoctor = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let requestedApprovals = yield Approval_Request_Model_1.default
            .find({
            requestFrom: doctorId,
            "delData.deleted": false,
        })
            .populate({
            path: "requestTo",
            select: {
                address: 1,
                name: 1,
            },
            populate: {
                path: "address",
                populate: {
                    path: "city state locality country",
                },
            },
        });
        return Promise.resolve(requestedApprovals);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getListOfRequestedApprovals_ByDoctor = getListOfRequestedApprovals_ByDoctor;
const doctorFields = Object.assign(Object.assign({}, Doctor_Controller_1.excludeDoctorFields), { hospitalDetails: 0, registration: 0, KYCDetails: 0, password: 0 });
/* Hospital ko kitno ne approval k liye request ki hai */
const getListOfRequestedApprovals_OfHospital = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let requestedApprovals = yield Approval_Request_Model_1.default
            .find({
            requestTo: hospitalId,
            "delData.deleted": false,
        })
            .populate({
            path: "requestFrom",
            select: doctorFields,
            populate: {
                path: "qualification specialization",
            },
        });
        return Promise.resolve(requestedApprovals);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getListOfRequestedApprovals_OfHospital = getListOfRequestedApprovals_OfHospital;
/* Hospital ne kitno se approval ki request ki hai */
const getListOfRequestedApprovals_ByHospital = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let requestedApprovals = yield Approval_Request_Model_1.default
            .find({
            requestFrom: hospitalId,
        })
            .populate({
            path: "requestTo",
            select: doctorFields,
            populate: {
                path: "qualification specialization",
            },
        });
        return Promise.resolve(requestedApprovals);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getListOfRequestedApprovals_ByHospital = getListOfRequestedApprovals_ByHospital;
const addHospitalToDoctorProfile = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield Doctors_Model_1.default.findOneAndUpdate({ _id: doctorId }, { $addToSet: { hospitalDetails: { hospital: hospitalId } } });
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
const addDoctorToHospitalProfile = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield Hospital_Model_1.default.findOneAndUpdate({ _id: hospitalId }, { $addToSet: { doctors: doctorId } });
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
const addDoctorAndHospitalToEachOthersProfile = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield Promise.all([
            addHospitalToDoctorProfile(doctorId, hospitalId),
            addDoctorToHospitalProfile(doctorId, hospitalId),
        ]);
        if (response.includes(false)) {
            throw new Error("Unexpected error occured");
        }
        else {
            return Promise.resolve(true);
        }
        return Promise.resolve(response);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
