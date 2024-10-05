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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentPreBooking = void 0;
const Classes_1 = require("../Classes");
const Manager_1 = require("../Manager");
const Appointment_Pre_Booking_1 = require("../Services/Appointment Pre Booking");
let AppointmentPreBooking = class AppointmentPreBooking extends Classes_1.Base {
    constructor(appointmentPreBookingService) {
        super();
        this.appointmentPreBookingService = appointmentPreBookingService;
    }
    details(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.params;
            const { timings } = req.query;
            const preBookingDetails = yield this.appointmentPreBookingService.getAppointmentPreBookingDetailsForPatient(doctorId, timings);
            return Promise.resolve(preBookingDetails);
        });
    }
    hospitalDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hospitalId } = req.params;
            const { timings } = req.query;
            const preBookingDetails = yield this.appointmentPreBookingService.getAppointmentPreBookingDetailsForHospital(hospitalId, timings);
            return Promise.resolve(preBookingDetails);
        });
    }
};
__decorate([
    Manager_1.TaskRunner.Bundle(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentPreBooking.prototype, "details", null);
__decorate([
    Manager_1.TaskRunner.Bundle(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentPreBooking.prototype, "hospitalDetails", null);
AppointmentPreBooking = __decorate([
    Manager_1.AutoBind,
    __metadata("design:paramtypes", [Appointment_Pre_Booking_1.AppointmentPreBookingService])
], AppointmentPreBooking);
exports.AppointmentPreBooking = AppointmentPreBooking;