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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentPreBookingForHospitalService = void 0;
const Classes_1 = require("../../Classes");
const Handler_1 = require("../../Handler");
const Manager_1 = require("../../Manager");
const Appointment_Schedule_1 = require("../Appointment Schedule");
const Helpers_1 = require("../Helpers");
const Hospital_Service_1 = require("../Hospital/Hospital.Service");
const Utils_1 = require("../Utils");
const moment_1 = __importDefault(require("moment"));
class AppointmentPreBookingForHospitalService extends Classes_1.Base {
    constructor(appointmentCommonService) {
        super();
        this.appointmentCommonService = appointmentCommonService;
        this.appointmentScheduleUtil = Appointment_Schedule_1.AppointmentScheduleUtil.Init(Handler_1.ValidationHandler.Init());
        this.errorFactory = Handler_1.ErrorFactory.Init();
    }
    getAppointmentPreBookingDetails(hospitalId, timings) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let hospitals = yield (0, Hospital_Service_1.doctorsInHospital)(hospitalId, timings);
            const doctorIdsStr = hospitals === null || hospitals === void 0 ? void 0 : hospitals.doctors.map((e) => {
                var _a;
                return (_a = e === null || e === void 0 ? void 0 : e._id) === null || _a === void 0 ? void 0 : _a.toString();
            });
            let doesDoctorTakeOverTheCounterPaymentPromise = this.appointmentScheduleUtil.checkIfDoctorTakesOverTheCounterPaymentsForMultipleDoctors(hospitalId, doctorIdsStr);
            let advancedBookingPeriodPromise = this.appointmentScheduleUtil.getDoctorsAdvancedBookingPeriodForMultipleDoctors(hospitalId, doctorIdsStr);
            let [doesDoctorTakeOverTheCounterPayment, advancedBookingPeriod] = yield Promise.all([doesDoctorTakeOverTheCounterPaymentPromise, advancedBookingPeriodPromise]);
            let canDoctorTakeAppointment = this.appointmentScheduleUtil.checkIfAdvancedBookingPeriodValidForMultiplePeriods((0, moment_1.default)(timings), advancedBookingPeriod);
            let day = new Date(timings).getDay();
            let doctorDetails = (_a = hospitals === null || hospitals === void 0 ? void 0 : hospitals.doctors) === null || _a === void 0 ? void 0 : _a.map((e) => this.doctorPreBookingDetails(e, hospitalId, day));
            doctorDetails.forEach((doctor) => {
                // Check if the doctorId exists in canDoctorTakeAppointment
                const doctorCanTakeAppointment = canDoctorTakeAppointment.some(appointment => {
                    if (appointment.doctorId.toString() == doctor.id.toString()) {
                        return appointment.valid;
                    }
                });
                // Check if the doctorId exists in doesDoctorTakeOverTheCounterPayment
                const doctorOverTheCounterPayment = doesDoctorTakeOverTheCounterPayment.some(payment => payment.doctor.toString() === doctor.id.toString());
                // Set the values in doctordetails
                doctor.canDoctorAppointment = doctorCanTakeAppointment;
                doctor.overTheCounterPayment = doctorOverTheCounterPayment;
            });
            let hospitalDetails = this.hospitalPreBookingDetails(hospitals);
            return Promise.resolve({ doctorDetails, hospitalDetails });
        });
    }
    hospitalPreBookingDetails(hospitalDetails) {
        var _a, _b;
        const address = hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails.address;
        return {
            "_id": hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails._id,
            "name": hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails.name,
            "address": `${(_a = address === null || address === void 0 ? void 0 : address.locality) === null || _a === void 0 ? void 0 : _a.name} ${(_b = address === null || address === void 0 ? void 0 : address.city) === null || _b === void 0 ? void 0 : _b.name}`
        };
    }
    doctorPreBookingDetails(doctor, hospitalId, day) {
        var _a, _b, _c, _d, _e;
        const doctorDetails = {
            id: doctor === null || doctor === void 0 ? void 0 : doctor._id,
            profileImage: doctor === null || doctor === void 0 ? void 0 : doctor.image,
            name: `${doctor === null || doctor === void 0 ? void 0 : doctor.firstName} ${doctor === null || doctor === void 0 ? void 0 : doctor.lastName}`,
            specilization: (_a = doctor === null || doctor === void 0 ? void 0 : doctor.specialization[0]) === null || _a === void 0 ? void 0 : _a.specialityName,
            Qualification: (_c = (_b = doctor === null || doctor === void 0 ? void 0 : doctor.qualification[0]) === null || _b === void 0 ? void 0 : _b.qualificationName) === null || _c === void 0 ? void 0 : _c.abbreviation,
            Exeperience: (_d = doctor === null || doctor === void 0 ? void 0 : doctor.totalExperience) !== null && _d !== void 0 ? _d : doctor === null || doctor === void 0 ? void 0 : doctor.overallExperience,
            Fee: (_e = doctor === null || doctor === void 0 ? void 0 : doctor.hospitalDetails.find((elem) => elem.hospital.toString() === hospitalId)) === null || _e === void 0 ? void 0 : _e.consultationFee.max,
            workinghour: doctor === null || doctor === void 0 ? void 0 : doctor.workingHours.map((elem) => {
                var _a, _b, _c, _d;
                const appointmentStartTime = (0, Utils_1.formatTime)(`${(_a = elem[Helpers_1.Weekdays[day]]) === null || _a === void 0 ? void 0 : _a.from.time}:${(_b = elem[Helpers_1.Weekdays[day]]) === null || _b === void 0 ? void 0 : _b.from.division}`);
                const appointmentEndTime = (0, Utils_1.formatTime)(`${(_c = elem[Helpers_1.Weekdays[day]]) === null || _c === void 0 ? void 0 : _c.till.time}:${(_d = elem[Helpers_1.Weekdays[day]]) === null || _d === void 0 ? void 0 : _d.till.division}`);
                return `${appointmentStartTime} to ${appointmentEndTime}`;
            }),
            capacityAndToken: doctor === null || doctor === void 0 ? void 0 : doctor.workingHours.map((elem) => {
                return {
                    capacity: elem[Helpers_1.Weekdays[day]].capacity,
                    largestToken: elem[Helpers_1.Weekdays[day]].appointmentsBooked,
                };
            }),
            capacity: "",
            highestToken: "",
            available: doctor === null || doctor === void 0 ? void 0 : doctor.available,
            scheduleAvailable: doctor === null || doctor === void 0 ? void 0 : doctor.scheduleAvailable,
        };
        doctorDetails["slot"] = this.appointmentCommonService.doesDoctorHaveCapacityForWorkingHour(doctorDetails.workinghour, doctorDetails.capacityAndToken);
        return doctorDetails;
    }
}
__decorate([
    Manager_1.TaskRunner.Bundle()
], AppointmentPreBookingForHospitalService.prototype, "getAppointmentPreBookingDetails", null);
exports.AppointmentPreBookingForHospitalService = AppointmentPreBookingForHospitalService;
