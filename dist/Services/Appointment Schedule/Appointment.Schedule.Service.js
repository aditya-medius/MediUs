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
exports.getAppointmentDetailsForDoctors = exports.setAppointmentDetailsForDoctors = void 0;
const Prescription_Validity_Controller_1 = require("../../Controllers/Prescription-Validity.Controller");
const Handler_1 = require("../../Handler");
const Doctor_Service_1 = require("../Doctor/Doctor.Service");
const Appointment_Schedule_Util_1 = require("./Appointment.Schedule.Util");
const setAppointmentDetailsForDoctors = (doctorScheduleDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, hospitalId, validateTill, bookingPeriod, consultationFee } = doctorScheduleDetails;
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!(bookingPeriod && consultationFee && validateTill)) {
            const error = new Error("Invalid values to update");
            throw error;
        }
        yield Promise.all([
            (0, Appointment_Schedule_Util_1.setAdvancedBookingPeriodForDoctor)(doctorId, hospitalId, bookingPeriod),
            (0, Appointment_Schedule_Util_1.setConsultationFeeForDoctor)(doctorId, hospitalId, consultationFee),
            (0, Appointment_Schedule_Util_1.setPrescriptionValidityForDoctor)(doctorId, hospitalId, validateTill),
        ]);
        return Promise.resolve(true);
    }));
    return yield exceptionHandler.validateObjectIds(doctorId, hospitalId).handleServiceExceptions();
});
exports.setAppointmentDetailsForDoctors = setAppointmentDetailsForDoctors;
const getAppointmentDetailsForDoctors = (doctorId, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const [bookingPeriodRes, PrescipriptionValidityResAndConsultationFeeRes, acceptsOverTheCounterPayment] = yield Promise.all([
            (0, Appointment_Schedule_Util_1.getAdvancedBookingPeriodForDoctor)(doctorId, hospitalId),
            (0, Prescription_Validity_Controller_1.getPrescriptionValidityAndFeesOfDoctorInHospital)(hospitalId, doctorId),
            (0, Doctor_Service_1.checkIfDoctorTakesOverTheCounterPaymentsForAHospital)(doctorId, hospitalId)
        ]);
        const [prescriptionValidity, consultationFee] = PrescipriptionValidityResAndConsultationFeeRes;
        return Promise.resolve({ bookingPeriod: bookingPeriodRes, doctorId, hospitalId, validateTill: (_a = prescriptionValidity === null || prescriptionValidity === void 0 ? void 0 : prescriptionValidity.prescription) === null || _a === void 0 ? void 0 : _a.validateTill, consultationFee: consultationFee === null || consultationFee === void 0 ? void 0 : consultationFee.consultationFee, acceptsOverTheCounterPayment });
    }));
    const result = yield exceptionHandler.validateObjectIds(doctorId, hospitalId).handleServiceExceptions();
    return result;
});
exports.getAppointmentDetailsForDoctors = getAppointmentDetailsForDoctors;
