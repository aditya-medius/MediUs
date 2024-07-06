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
exports.checkIfHospitalAlreadyExistInDoctor = exports.updateNotificationReadStatus = exports.getNotificationFromRequestId = exports.getRequestIdFromNotificationId = exports.checkIfNotificationExist = exports.addDoctorAndHospitalToEachOthersProfile = exports.getListOfRequestedApprovals_ByHospital = exports.getListOfRequestedApprovals_OfHospital = exports.getListOfRequestedApprovals_ByDoctor = exports.getListOfRequestedApprovals_OfDoctor = exports.doctorKLiyeHospitalKiRequestExistKrtiHai = exports.hospitalKLiyeDoctorKiRequestExistKrtiHai = exports.canThisHospitalApproveThisRequest = exports.canThisDoctorApproveThisRequest = exports.checkHospitalsApprovalStatus = exports.checkDoctorsApprovalStatus = exports.denyDoctorRequest = exports.approveDoctorRequest = exports.requestApprovalFromHospital = exports.denyHospitalRequest = exports.approveHospitalRequest = exports.requestApprovalFromDoctor = void 0;
const Doctor_Controller_1 = require("../../Controllers/Doctor.Controller");
const Approval_Request_Model_1 = __importDefault(require("../../Models/Approval-Request.Model"));
const Doctors_Model_1 = __importDefault(require("../../Models/Doctors.Model"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
const Notification_Model_1 = __importDefault(require("../../Models/Notification.Model"));
const schemaNames_1 = require("../schemaNames");
const Utils_1 = require("../Utils");
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
        yield (0, exports.addDoctorAndHospitalToEachOthersProfile)(request.requestTo, request.requestFrom);
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
        let request = yield Approval_Request_Model_1.default
            .findOne({ _id: requestId }, "requestFrom requestTo")
            .lean();
        yield (0, exports.addDoctorAndHospitalToEachOthersProfile)(request.requestFrom, request.requestTo);
        return Promise.resolve(request);
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
        let requestedApprovals = yield Approval_Request_Model_1.default
            .find({
            requestTo: doctorId,
            "delData.deleted": false,
        }, "-requestTo")
            .populate({
            path: "requestFrom",
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
exports.getListOfRequestedApprovals_OfDoctor = getListOfRequestedApprovals_OfDoctor;
/* Doctor ne kitno se approval ki request ki hai */
const getListOfRequestedApprovals_ByDoctor = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let requestedApprovals = yield Approval_Request_Model_1.default
            .find({
            requestFrom: doctorId,
            "delData.deleted": false,
        }, "-requestFrom")
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
const doctorFields = Object.assign(Object.assign({}, Doctor_Controller_1.excludeDoctorFields), { hospitalDetails: 0, 
    // registration: 0,
    KYCDetails: 0, password: 0 });
/* Hospital ko kitno ne approval k liye request ki hai */
const getListOfRequestedApprovals_OfHospital = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let requestedApprovals = yield Approval_Request_Model_1.default
            .find({
            requestTo: hospitalId,
            approvalStatus: "Pending",
            "delData.deleted": false,
        })
            .populate({
            path: "requestFrom",
            select: doctorFields,
            populate: {
                path: "qualification specialization",
            },
        })
            .lean();
        requestedApprovals.forEach((e) => {
            var _a, _b;
            e.requestFrom["experience"] = (0, Utils_1.getAge)((_b = (_a = e === null || e === void 0 ? void 0 : e.requestFrom) === null || _a === void 0 ? void 0 : _a.registration) === null || _b === void 0 ? void 0 : _b.registrationDate);
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
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.addDoctorAndHospitalToEachOthersProfile = addDoctorAndHospitalToEachOthersProfile;
const checkIfNotificationExist = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield Notification_Model_1.default.exists({ _id: notificationId }));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.checkIfNotificationExist = checkIfNotificationExist;
const getRequestIdFromNotificationId = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { sender, receiver } = yield Notification_Model_1.default
            .findOne({
            _id: notificationId,
        }, "sender receiver")
            .lean();
        let { _id } = yield Approval_Request_Model_1.default
            .findOne({
            requestFrom: sender,
            requestTo: receiver,
        })
            .lean();
        return Promise.resolve(_id);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getRequestIdFromNotificationId = getRequestIdFromNotificationId;
const getNotificationFromRequestId = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("khghvhbdsds", requestId);
        let { requestFrom, requestTo } = yield Approval_Request_Model_1.default
            .findOne({ _id: requestId })
            .lean();
        let { _id } = yield Notification_Model_1.default
            .findOne({ sender: requestFrom, receiver: requestTo })
            .lean();
        return Promise.resolve(_id);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getNotificationFromRequestId = getNotificationFromRequestId;
const updateNotificationReadStatus = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification_Model_1.default.findOneAndUpdate({ _id: notificationId }, {
            $set: {
                "readDetails.isRead": true,
                "readDetails.readDate": new Date(),
            },
        });
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.updateNotificationReadStatus = updateNotificationReadStatus;
const checkIfHospitalAlreadyExistInDoctor = (hospitalId, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let exist = yield Doctors_Model_1.default.exists({
            _id: doctorId,
            "hospitalDetails.hospital": hospitalId,
        });
        if (!exist) {
            return Promise.resolve(true);
        }
        else {
            return Promise.reject(new Error("This hospital is already in doctor's profile"));
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.checkIfHospitalAlreadyExistInDoctor = checkIfHospitalAlreadyExistInDoctor;
