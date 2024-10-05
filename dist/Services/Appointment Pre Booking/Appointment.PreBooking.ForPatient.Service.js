"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.AppointmentPreBookingForPatientService = void 0;
const Classes_1 = require("../../Classes");
const Handler_1 = require("../../Handler");
const Manager_1 = require("../../Manager");
const Appointment_Schedule_1 = require("../Appointment Schedule");
const Helpers_1 = require("../Helpers");
const Hospital_Service_1 = require("../Hospital/Hospital.Service");
const Utils_1 = require("../Utils");
const moment_1 = __importDefault(require("moment"));
class AppointmentPreBookingForPatientService extends Classes_1.Base {
    constructor(appointmentCommonService) {
        super();
        this.appointmentCommonService = appointmentCommonService;
        this.appointmentScheduleUtil = Appointment_Schedule_1.AppointmentScheduleUtil.Init(Handler_1.ValidationHandler.Init());
        this.errorFactory = Handler_1.ErrorFactory.Init();
    }
    getAppointmentPreBookingDetails(doctorId, timings) {
        return __awaiter(this, void 0, void 0, function* () {
            let doctors = yield (0, Hospital_Service_1.hospitalsInDoctor)(doctorId, timings);
            const hospitalIds = doctors === null || doctors === void 0 ? void 0 : doctors.hospitalDetails.map((e) => {
                let data = e === null || e === void 0 ? void 0 : e.hospital;
                return {
                    id: data === null || data === void 0 ? void 0 : data._id,
                };
            });
            const hospitalIdStr = hospitalIds.map((data) => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.id) === null || _a === void 0 ? void 0 : _a.toString(); });
            let doesDoctorTakeOverTheCounterPaymentPromise = this.appointmentScheduleUtil.checkIfDoctorTakesOverTheCounterPaymentsForMultipleHospital(doctorId, hospitalIdStr);
            let advancedBookingPeriodPromise = this.appointmentScheduleUtil.getDoctorsAdvancedBookingPeriodForMultipleHospitals(doctorId, hospitalIdStr);
            let [doesDoctorTakeOverTheCounterPayment, advancedBookingPeriod] = yield Promise.all([doesDoctorTakeOverTheCounterPaymentPromise, advancedBookingPeriodPromise]);
            let canDoctorTakeAppointment = this.appointmentScheduleUtil.checkIfAdvancedBookingPeriodValidForMultiplePeriods((0, moment_1.default)(timings), advancedBookingPeriod);
            let day = new Date(timings).getDay();
            let doctordetails = this.doctorPreBookingDetails(doctors);
            let hospitaldetails = doctors === null || doctors === void 0 ? void 0 : doctors.hospitalDetails.map((e) => this.hospitalPreBookingDetails(e, day));
            hospitaldetails.forEach((hospital) => {
                // Check if the hospitalId exists in canDoctorTakeAppointment
                const doctorCanTakeAppointment = canDoctorTakeAppointment.some(appointment => {
                    if (appointment.hospitalId.toString() == hospital.id.toString()) {
                        return appointment.valid;
                    }
                });
                // Check if the hospitalId exists in doesDoctorTakeOverTheCounterPayment
                const doctorOverTheCounterPayment = doesDoctorTakeOverTheCounterPayment.some(payment => payment.hospital.toString() === hospital.id.toString());
                // Set the values in hospitaldetails
                hospital.canDoctorAppointment = doctorCanTakeAppointment;
                hospital.overTheCounterPayment = doctorOverTheCounterPayment;
            });
            return Promise.resolve({ doctordetails, hospitaldetails });
        });
    }
    hospitalPreBookingDetails(allHospitalDetails, day) {
        var _a, _b, _c, _d, _e, _f, _g;
        let data = allHospitalDetails === null || allHospitalDetails === void 0 ? void 0 : allHospitalDetails.hospital;
        const bookingDetailsForHospital = {
            id: data === null || data === void 0 ? void 0 : data._id,
            name: data === null || data === void 0 ? void 0 : data.name,
            address: `${(_b = (_a = data === null || data === void 0 ? void 0 : data.address) === null || _a === void 0 ? void 0 : _a.locality) === null || _b === void 0 ? void 0 : _b.name}, ${(_d = (_c = data === null || data === void 0 ? void 0 : data.address) === null || _c === void 0 ? void 0 : _c.city) === null || _d === void 0 ? void 0 : _d.name}`,
            fee: (_e = allHospitalDetails === null || allHospitalDetails === void 0 ? void 0 : allHospitalDetails.consultationFee) === null || _e === void 0 ? void 0 : _e.min,
            prescription_validity: (_f = allHospitalDetails === null || allHospitalDetails === void 0 ? void 0 : allHospitalDetails.prescription) === null || _f === void 0 ? void 0 : _f.validateTill,
            time: (_g = allHospitalDetails === null || allHospitalDetails === void 0 ? void 0 : allHospitalDetails.workingHours) === null || _g === void 0 ? void 0 : _g.map((elem) => {
                var _a, _b, _c, _d;
                const appointmentStartTime = (0, Utils_1.formatTime)(`${(_a = elem[Helpers_1.Weekdays[day]]) === null || _a === void 0 ? void 0 : _a.from.time}:${(_b = elem[Helpers_1.Weekdays[day]]) === null || _b === void 0 ? void 0 : _b.from.division}`);
                const appointmentEndTime = (0, Utils_1.formatTime)(`${(_c = elem[Helpers_1.Weekdays[day]]) === null || _c === void 0 ? void 0 : _c.till.time}:${(_d = elem[Helpers_1.Weekdays[day]]) === null || _d === void 0 ? void 0 : _d.till.division}`);
                return `${appointmentStartTime} to ${appointmentEndTime}`;
            }),
            capacityAndToken: allHospitalDetails === null || allHospitalDetails === void 0 ? void 0 : allHospitalDetails.workingHours.map((elem) => {
                return {
                    capacity: elem[Helpers_1.Weekdays[day]].capacity,
                    largestToken: elem[Helpers_1.Weekdays[day]].appointmentsBooked,
                };
            }),
            available: allHospitalDetails === null || allHospitalDetails === void 0 ? void 0 : allHospitalDetails.available,
            scheduleAvailable: allHospitalDetails === null || allHospitalDetails === void 0 ? void 0 : allHospitalDetails.scheduleAvailable,
            lat: data === null || data === void 0 ? void 0 : data.lat,
            lng: data === null || data === void 0 ? void 0 : data.lng,
            contactNumber: data === null || data === void 0 ? void 0 : data.contactNumber,
            status: data === null || data === void 0 ? void 0 : data.status,
            profileImage: data === null || data === void 0 ? void 0 : data.profileImage,
        };
        bookingDetailsForHospital["slot"] = this.appointmentCommonService.doesDoctorHaveCapacityForWorkingHour(bookingDetailsForHospital.time, bookingDetailsForHospital.capacityAndToken);
        return bookingDetailsForHospital;
    }
    doctorPreBookingDetails(allDoctorDetails) {
        var _a, _b, _c, _d, _e;
        return {
            _id: allDoctorDetails === null || allDoctorDetails === void 0 ? void 0 : allDoctorDetails._id,
            name: `${allDoctorDetails.firstName} ${allDoctorDetails.lastName}`,
            specilization: (_b = (_a = allDoctorDetails === null || allDoctorDetails === void 0 ? void 0 : allDoctorDetails.specialization) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.specialityName,
            qualification: (_e = (_d = (_c = allDoctorDetails === null || allDoctorDetails === void 0 ? void 0 : allDoctorDetails.qualification) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.qualificationName) === null || _e === void 0 ? void 0 : _e.name,
            experience: allDoctorDetails === null || allDoctorDetails === void 0 ? void 0 : allDoctorDetails.overallExperience,
        };
    }
}
__decorate([
    Manager_1.TaskRunner.Bundle(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentPreBookingForPatientService.prototype, "getAppointmentPreBookingDetails", null);
exports.AppointmentPreBookingForPatientService = AppointmentPreBookingForPatientService;
