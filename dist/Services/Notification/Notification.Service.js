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
exports.getPatientsNotification = exports.getDoctorsNotification_whenSenderIsPatient = exports.getDoctorsNotification_whenSenderIsHospital = exports.getHospitalsNotification_whenSenderIsPatient = exports.getHospitalsNotification_whenSenderIsDoctor = exports.sendAppointmentConfirmationNotificationToPatient = exports.sendAppointmentNotificationToHospitalAndDoctor_FromPatient = exports.sendApprovalRequestNotificationToHospital_FromDoctor = exports.sendApprovalRequestNotificationToDoctor_FromHospital = void 0;
const Notification_Model_1 = __importDefault(require("../../Models/Notification.Model"));
const Notification_Type_Model_1 = __importDefault(require("../../Models/Notification-Type.Model"));
const schemaNames_1 = require("../schemaNames");
const notification_1 = require("twilio/lib/rest/api/v2010/account/notification");
const Doctor_Controller_1 = require("../../Controllers/Doctor.Controller");
const Patient_Controller_1 = require("../../Controllers/Patient.Controller");
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
const sendAppointmentNotificationToHospitalAndDoctor_FromPatient = (doctorId, hospitalId, patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notificationType = yield getRelevantNotificationType("New Appointment");
        let doc = [
            {
                notificationId: generateNotificationId(),
                notificationType,
                sender: patientId,
                sender_ref: schemaNames_1.patient,
                receiver: doctorId,
                receiver_ref: schemaNames_1.doctor,
            },
            {
                notificationId: generateNotificationId(),
                notificationType,
                sender: patientId,
                sender_ref: schemaNames_1.patient,
                receiver: hospitalId,
                receiver_ref: schemaNames_1.hospital,
            },
        ];
        let notification = yield Notification_Model_1.default.insertMany(doc);
        return Promise.resolve(notification_1.NotificationContext);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.sendAppointmentNotificationToHospitalAndDoctor_FromPatient = sendAppointmentNotificationToHospitalAndDoctor_FromPatient;
const sendAppointmentConfirmationNotificationToPatient = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.sendAppointmentConfirmationNotificationToPatient = sendAppointmentConfirmationNotificationToPatient;
const hospitalFields = Object.assign(Object.assign({}, Patient_Controller_1.excludeHospitalFields), { services: 0 });
const doctorFields = Object.assign(Object.assign({}, Doctor_Controller_1.excludeDoctorFields), { hospitalDetails: 0, overallExperience: 0, qualification: 0, id: 0, specialization: 0, _id: 0 });
const getHospitalsNotification_whenSenderIsDoctor = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notifications = yield Notification_Model_1.default
            .find({ receiver: hospitalId, sender_ref: schemaNames_1.doctor })
            .populate({
            path: "sender",
            select: doctorFields,
        })
            .populate({
            path: "receiver",
            select: hospitalFields,
        });
        return Promise.resolve(notifications);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHospitalsNotification_whenSenderIsDoctor = getHospitalsNotification_whenSenderIsDoctor;
const getHospitalsNotification_whenSenderIsPatient = (hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notifications = yield Notification_Model_1.default
            .find({ receiver: hospitalId, sender_ref: schemaNames_1.patient })
            .populate({
            path: "sender",
            select: Object.assign({}, Patient_Controller_1.excludePatientFields),
        })
            .populate({
            path: "receiver",
            select: hospitalFields,
        });
        return Promise.resolve(notifications);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHospitalsNotification_whenSenderIsPatient = getHospitalsNotification_whenSenderIsPatient;
const getDoctorsNotification_whenSenderIsHospital = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notifications = yield Notification_Model_1.default
            .find({ receiver: doctorId })
            .populate({
            path: "sender",
            select: hospitalFields,
            populate: {
                path: "address",
                populate: {
                    path: "city state locality country",
                },
            },
        })
            .populate({
            path: "receiver",
            select: doctorFields,
        });
        return Promise.resolve(notifications);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsNotification_whenSenderIsHospital = getDoctorsNotification_whenSenderIsHospital;
const getDoctorsNotification_whenSenderIsPatient = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notifications = yield Notification_Model_1.default
            .find({ receiver: doctorId })
            .populate({
            path: "sender",
            select: Object.assign({}, Patient_Controller_1.excludePatientFields),
            populate: {
                path: "address",
                populate: {
                    path: "city state locality country",
                },
            },
        })
            .populate({
            path: "receiver",
            select: doctorFields,
        });
        return Promise.resolve(notifications);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsNotification_whenSenderIsPatient = getDoctorsNotification_whenSenderIsPatient;
const getPatientsNotification = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notifications = yield Notification_Model_1.default
            .find({ receiver: patientId })
            .populate({
            path: "sender",
        })
            .populate({
            path: "receiver",
            select: doctorFields,
        });
        return Promise.resolve(notifications);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getPatientsNotification = getPatientsNotification;
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
