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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkingHoursCapacity = exports.getAdvancedBookingPeriodForDoctor = exports.setPrescriptionValidityForDoctor = exports.setConsultationFeeForDoctor = exports.setAdvancedBookingPeriodForDoctor = void 0;
const Handler_1 = require("../../Handler");
const Prescription_Validity_Model_1 = __importDefault(require("../../Models/Prescription-Validity.Model"));
const WorkingHours_Model_1 = __importDefault(require("../../Models/WorkingHours.Model"));
const doctorService = __importStar(require("../Doctor/Doctor.Service"));
const Helpers_1 = require("../Helpers");
const setAdvancedBookingPeriodForDoctor = (doctorId, hospitalId, bookingPeriod) => __awaiter(void 0, void 0, void 0, function* () {
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!bookingPeriod) {
            const error = new Error("Invalid values for booking period");
            throw error;
        }
        const result = yield doctorService.setDoctorsAdvancedBookingPeriod(doctorId, hospitalId, bookingPeriod);
        return Promise.resolve(result);
    }));
    return yield exceptionHandler.handleServiceExceptions();
});
exports.setAdvancedBookingPeriodForDoctor = setAdvancedBookingPeriodForDoctor;
const setConsultationFeeForDoctor = (doctorId, hospitalId, consultationFee) => __awaiter(void 0, void 0, void 0, function* () {
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!consultationFee) {
            const error = new Error("Invalid consultation fee");
            throw error;
        }
        let result = yield doctorService.setConsultationFeeForDoctor(doctorId, hospitalId, consultationFee);
        return Promise.resolve(result);
    }));
    return yield exceptionHandler.handleServiceExceptions();
});
exports.setConsultationFeeForDoctor = setConsultationFeeForDoctor;
const setPrescriptionValidityForDoctor = (doctorId, hospitalId, validateTill) => __awaiter(void 0, void 0, void 0, function* () {
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!validateTill) {
            const error = new Error("Invalid validate till");
            throw error;
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
    }));
    return yield exceptionHandler.handleServiceExceptions();
});
exports.setPrescriptionValidityForDoctor = setPrescriptionValidityForDoctor;
const getAdvancedBookingPeriodForDoctor = (doctorId, hospital) => __awaiter(void 0, void 0, void 0, function* () {
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield doctorService.getDoctorsAdvancedBookingPeriod(doctorId, hospital);
        return Promise.resolve(result);
    }));
    return yield exceptionHandler.handleServiceExceptions();
});
exports.getAdvancedBookingPeriodForDoctor = getAdvancedBookingPeriodForDoctor;
const updateWorkingHoursCapacity = (workingHourId, capacity) => __awaiter(void 0, void 0, void 0, function* () {
    const exceptionHandler = new Handler_1.ExceptionHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        let workingHour = yield WorkingHours_Model_1.default.findOne({
            _id: workingHourId,
        });
        Object.keys(workingHour.toJSON()).forEach((elem) => {
            if (Helpers_1.Weekdays.includes(elem)) {
                console.log("elem", elem);
                workingHour[elem].capacity = capacity;
            }
        });
        yield workingHour.save();
        return Promise.resolve(true);
    }));
    return yield exceptionHandler.handleServiceExceptions();
});
exports.updateWorkingHoursCapacity = updateWorkingHoursCapacity;
