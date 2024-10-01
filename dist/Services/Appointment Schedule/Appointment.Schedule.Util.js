"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentScheduleUtil = void 0;
const Classes_1 = require("../../Classes");
const Handler_1 = require("../../Handler");
const Manager_1 = require("../../Manager");
const AdvancedBookingPeriod_1 = __importDefault(require("../../Models/AdvancedBookingPeriod"));
const OverTheCounterPayment_1 = __importDefault(require("../../Models/OverTheCounterPayment"));
const Prescription_Validity_Model_1 = __importDefault(require("../../Models/Prescription-Validity.Model"));
const WorkingHours_Model_1 = __importDefault(require("../../Models/WorkingHours.Model"));
const doctorService = __importStar(require("../Doctor/Doctor.Service"));
const Helpers_1 = require("../Helpers");
const Patient_Service_1 = require("../Patient/Patient.Service");
const errorFactory = new Handler_1.ErrorFactory();
class AppointmentScheduleUtil extends Classes_1.Base {
    constructor(_validationHandler) {
        super();
        this.validationHandler = _validationHandler;
    }
    setAdvancedBookingPeriodForDoctor(doctorId, hospitalId, bookingPeriod) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookingPeriod) {
                const error = new Error("Invalid values for booking period");
                throw error;
            }
            this.validationHandler.validateObjectIds(doctorId, hospitalId);
            if (typeof bookingPeriod !== "number") {
                errorFactory.incorrectType = { value: "bookingPeriod", incorrectType: typeof bookingPeriod, correctType: "number" };
                const errorMessage = errorFactory.incorrectType;
                throw errorFactory.createError(Helpers_1.ErrorTypes.IncorrectType, errorMessage);
            }
            const result = yield doctorService.setDoctorsAdvancedBookingPeriod(doctorId, hospitalId, bookingPeriod);
            return Promise.resolve(result);
        });
    }
    setConsultationFeeForDoctor(doctorId, hospitalId, consultationFee) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationHandler.validateObjectIds(doctorId, hospitalId);
            if (!consultationFee) {
                const error = new Error("Invalid consultation fee");
                throw error;
            }
            if (typeof consultationFee !== "object") {
                errorFactory.incorrectType = { value: "consultationFee", incorrectType: typeof consultationFee, correctType: "number" };
                const errorMessage = errorFactory.incorrectType;
                throw errorFactory.createError(Helpers_1.ErrorTypes.IncorrectType, errorMessage);
            }
            let result = yield doctorService.setConsultationFeeForDoctor(doctorId, hospitalId, consultationFee);
            return Promise.resolve(result);
        });
    }
    setPrescriptionValidityForDoctor(doctorId, hospitalId, validateTill) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!validateTill) {
                const error = new Error("Invalid validate till");
                throw error;
            }
            this.validationHandler.validateObjectIds(doctorId, hospitalId);
            if (typeof validateTill !== "number") {
                errorFactory.incorrectType = { value: "validateTill", incorrectType: typeof validateTill, correctType: "number" };
                const errorMessage = errorFactory.incorrectType;
                throw errorFactory.createError(Helpers_1.ErrorTypes.IncorrectType, errorMessage);
            }
            let prescription = yield Prescription_Validity_Model_1.default.findOneAndUpdate({
                doctorId,
                hospitalId,
            }, {
                $set: {
                    validateTill,
                },
            }, {
                new: true,
                upsert: true,
            });
            return Promise.resolve(prescription);
        });
    }
    getAdvancedBookingPeriodForDoctor(doctorId, hospitalId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationHandler.validateObjectIds(doctorId, hospitalId);
            const result = yield doctorService.getDoctorsAdvancedBookingPeriod(doctorId, hospitalId);
            return Promise.resolve(result);
        });
    }
    updateWorkingHoursCapacity(workingHourId, capacity) {
        return __awaiter(this, void 0, void 0, function* () {
            let workingHour = yield WorkingHours_Model_1.default.findOne({
                _id: workingHourId,
            });
            Object.keys(workingHour.toJSON()).forEach((elem) => {
                if (Helpers_1.Weekdays.includes(elem)) {
                    workingHour[elem].capacity = capacity;
                }
            });
            yield workingHour.save();
            return Promise.resolve(true);
        });
    }
    checkIfDoctorTakesOverTheCounterPaymentsForMultipleHospital(doctorId, hospitalIds) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationHandler.validateObjectIds(doctorId, ...hospitalIds);
            const payments = yield OverTheCounterPayment_1.default.find({ doctorId, hospitalId: { $in: hospitalIds } }).lean();
            const result = payments === null || payments === void 0 ? void 0 : payments.map((data) => {
                var _a;
                let mapData = { hospital: data.hospitalId.toString() };
                if (hospitalIds.includes((_a = data === null || data === void 0 ? void 0 : data.hospitalId) === null || _a === void 0 ? void 0 : _a.toString())) {
                    mapData["exist"] = true;
                }
                else {
                    mapData["exist"] = false;
                }
                return mapData;
            });
            return Promise.resolve(result);
        });
    }
    getDoctorsAdvancedBookingPeriodForMultipleHospitals(doctorId, hospitalIds) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationHandler.validateObjectIds(doctorId, ...hospitalIds);
            let bookingPeriodRecord = yield AdvancedBookingPeriod_1.default.find({ doctorId, hospitalId: { $in: hospitalIds } }).lean();
            return Promise.resolve(bookingPeriodRecord);
        });
    }
    checkIfAdvancedBookingPeriodValidForMultiplePeriods(bookingDate, bookingPeriod) {
        const isValidPeriod = bookingPeriod.map((period) => {
            const validStatus = Object.assign(Object.assign({}, period), { valid: (0, Patient_Service_1.isAdvancedBookingValid)(bookingDate, period.bookingPeriod) });
            return validStatus;
        });
        return isValidPeriod;
    }
    checkIfDoctorTakesOverTheCounterPaymentsForMultipleDoctors(hospitalId, doctorIds) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationHandler.validateObjectIds(...doctorIds, hospitalId);
            const payments = yield OverTheCounterPayment_1.default.find({ hospitalId, doctorId: { $in: doctorIds } }).lean();
            const result = payments === null || payments === void 0 ? void 0 : payments.map((data) => {
                var _a;
                let mapData = { doctor: data.doctorId.toString(), exist: false };
                if (doctorIds.includes((_a = data === null || data === void 0 ? void 0 : data.doctorId) === null || _a === void 0 ? void 0 : _a.toString())) {
                    mapData["exist"] = true;
                }
                return mapData;
            });
            return Promise.resolve(result);
        });
    }
    getDoctorsAdvancedBookingPeriodForMultipleDoctors(hospitalId, doctorIds) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationHandler.validateObjectIds(...doctorIds, hospitalId);
            let bookingPeriodRecord = yield AdvancedBookingPeriod_1.default.find({ hospitalId, doctorId: { $in: doctorIds } }).lean();
            return Promise.resolve(bookingPeriodRecord);
        });
    }
}
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "setAdvancedBookingPeriodForDoctor", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "setConsultationFeeForDoctor", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "setPrescriptionValidityForDoctor", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "getAdvancedBookingPeriodForDoctor", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "updateWorkingHoursCapacity", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "checkIfDoctorTakesOverTheCounterPaymentsForMultipleHospital", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "getDoctorsAdvancedBookingPeriodForMultipleHospitals", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "checkIfDoctorTakesOverTheCounterPaymentsForMultipleDoctors", null);
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentScheduleUtil.prototype, "getDoctorsAdvancedBookingPeriodForMultipleDoctors", null);
exports.AppointmentScheduleUtil = AppointmentScheduleUtil;
