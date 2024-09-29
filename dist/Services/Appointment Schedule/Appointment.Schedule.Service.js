"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AppointmentScheduleService = void 0;
const Prescription_Validity_Controller_1 = require("../../Controllers/Prescription-Validity.Controller");
const Handler_1 = require("../../Handler");
const Manager_1 = require("../../Manager");
const Doctor_Service_1 = require("../Doctor/Doctor.Service");
const Helpers_1 = require("../Helpers");
const Appointment_Schedule_Util_1 = require("./Appointment.Schedule.Util");
const errorFactory = new Handler_1.ErrorFactory();
class AppointmentScheduleService {
    constructor() {
        this.validationHandler = new Handler_1.ValidationHandler();
        this.Init = () => new AppointmentScheduleService();
        this.appointmentScheduleUtil = new Appointment_Schedule_Util_1.AppointmentScheduleUtil(this.validationHandler);
    }
    setAppointmentDetailsForDoctors(doctorScheduleDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId, hospitalId, validateTill, bookingPeriod, consultationFee } = doctorScheduleDetails;
            this.validationHandler.validateObjectIds(doctorId, hospitalId);
            if (!(bookingPeriod && consultationFee && validateTill)) {
                errorFactory.invalidValueErrorMessage = "booking period, consultation fee, capacity";
                const errorMessage = errorFactory.invalidValueErrorMessage;
                throw errorFactory.createError(Helpers_1.ErrorTypes.UnsupportedRequestBody, errorMessage);
            }
            yield Promise.all([
                this.appointmentScheduleUtil.setAdvancedBookingPeriodForDoctor(doctorId, hospitalId, bookingPeriod),
                this.appointmentScheduleUtil.setConsultationFeeForDoctor(doctorId, hospitalId, consultationFee),
                this.appointmentScheduleUtil.setPrescriptionValidityForDoctor(doctorId, hospitalId, validateTill),
            ]);
            return Promise.resolve(true);
        });
    }
    getAppointmentDetailsForDoctors(doctorId, hospitalId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.validationHandler.validateObjectIds(doctorId, hospitalId);
            const [bookingPeriodRes, PrescipriptionValidityResAndConsultationFeeRes, acceptsOverTheCounterPayment] = yield Promise.all([
                this.appointmentScheduleUtil.getAdvancedBookingPeriodForDoctor(doctorId, hospitalId),
                (0, Prescription_Validity_Controller_1.getPrescriptionValidityAndFeesOfDoctorInHospital)(hospitalId, doctorId),
                (0, Doctor_Service_1.checkIfDoctorTakesOverTheCounterPaymentsForAHospital)(doctorId, hospitalId)
            ]);
            let [prescriptionValidity, consultationFee] = PrescipriptionValidityResAndConsultationFeeRes;
            return Promise.resolve({ bookingPeriod: bookingPeriodRes, doctorId, hospitalId, validateTill: (_a = prescriptionValidity === null || prescriptionValidity === void 0 ? void 0 : prescriptionValidity.prescription[0]) === null || _a === void 0 ? void 0 : _a.validateTill, consultationFee: (_b = consultationFee === null || consultationFee === void 0 ? void 0 : consultationFee.consultationFee) === null || _b === void 0 ? void 0 : _b.max, acceptsOverTheCounterPayment });
        });
    }
    updateWorkingHoursCapacityForDoctor(workingHourId, capacity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!capacity || typeof capacity !== "number") {
                errorFactory.invalidValueErrorMessage = "capacity";
                const errorMessage = errorFactory.invalidValueErrorMessage;
                throw errorFactory.createError(Helpers_1.ErrorTypes.UnsupportedRequestBody, errorMessage);
            }
            return yield this.appointmentScheduleUtil.updateWorkingHoursCapacity(workingHourId, capacity);
        });
    }
}
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleService.prototype, "setAppointmentDetailsForDoctors", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleService.prototype, "getAppointmentDetailsForDoctors", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleService.prototype, "updateWorkingHoursCapacityForDoctor", null);
exports.AppointmentScheduleService = AppointmentScheduleService;
