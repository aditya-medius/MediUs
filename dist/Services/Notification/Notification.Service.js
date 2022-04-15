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
exports.sendApprovalRequestNotificationToHospital_FromDoctor = exports.sendApprovalRequestNotificationToDoctor_FromHospital = void 0;
const Notification_Model_1 = __importDefault(require("../../Models/Notification.Model"));
const Notification_Type_Model_1 = __importDefault(require("../../Models/Notification-Type.Model"));
const schemaNames_1 = require("../schemaNames");
const sendApprovalRequestNotificationToDoctor_FromHospital = (hospitalId, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notificationId = generateNotificationId();
        let notificationType = yield getRelevantNotificationType("Approval Request");
        let n_sender = schemaNames_1.hospital;
        let n_receiver = schemaNames_1.doctor;
        let notification = yield new Notification_Model_1.default({
            notificationId: notificationId,
            sender: hospitalId,
            sender_ref: n_sender,
            receiver: doctorId,
            receiver_ref: n_receiver,
            notificationType: notificationType,
        }).save();
        return Promise.resolve(notification);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.sendApprovalRequestNotificationToDoctor_FromHospital = sendApprovalRequestNotificationToDoctor_FromHospital;
const sendApprovalRequestNotificationToHospital_FromDoctor = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notificationId = generateNotificationId(), notificationType = yield getRelevantNotificationType("Approval Request"), n_sender = schemaNames_1.doctor, n_receiver = schemaNames_1.hospital;
        let notification = yield new Notification_Model_1.default({
            notificationId: notificationId,
            sender: doctorId,
            sender_ref: n_sender,
            receiver: hospitalId,
            receiver_ref: n_receiver,
            notificationType: notificationType,
        }).save();
        return Promise.resolve(notification);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.sendApprovalRequestNotificationToHospital_FromDoctor = sendApprovalRequestNotificationToHospital_FromDoctor;
const generateNotificationId = () => {
    var characters = "ABCDEFGHIJKLMONPQRSTUVWXYZ0123456789";
    var result = "";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
const getRelevantNotificationType = (type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notificationType = yield Notification_Type_Model_1.default.findOne({
            Type: type,
        }, "_id");
        return Promise.resolve(notificationType._id);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
