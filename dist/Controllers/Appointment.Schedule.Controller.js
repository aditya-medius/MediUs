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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorsAppointmentDetails = exports.setDoctorsAppointmentDetails = void 0;
const Appointment_Schedule_1 = require("../Services/Appointment Schedule");
const Handler_1 = require("../Handler");
const setDoctorsAppointmentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        const { doctorId, hospitalId, bookingPeriod, consultationFee, validateTill } = req.body;
        const doctorScheduleDetials = {
            doctorId,
            hospitalId,
            consultationFee: consultationFee === null || consultationFee === void 0 ? void 0 : consultationFee.max,
            validateTill,
            bookingPeriod
        };
        return yield (0, Appointment_Schedule_1.setAppointmentDetailsForDoctors)(doctorScheduleDetials);
    }));
    return yield exceptionHandler.handleResponseException(req, res);
});
exports.setDoctorsAppointmentDetails = setDoctorsAppointmentDetails;
const getDoctorsAppointmentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        const { doctorId, hospitalId } = req.query;
        return yield (0, Appointment_Schedule_1.getAppointmentDetailsForDoctors)(doctorId, hospitalId);
    }));
    return yield exceptionHandler.handleResponseException(req, res);
});
exports.getDoctorsAppointmentDetails = getDoctorsAppointmentDetails;
