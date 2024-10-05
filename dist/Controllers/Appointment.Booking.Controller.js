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
var AppointmentBookingController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentBookingController = void 0;
const Appointment_Booking_1 = require("../Services/Appointment Booking");
const Manager_1 = require("../Manager");
let AppointmentBookingController = AppointmentBookingController_1 = class AppointmentBookingController {
    constructor() { }
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Appointment_Booking_1.verifyPayment_forBooking)(req, res);
            return;
        });
    }
    generateOrderId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Appointment_Booking_1.generateOrderId_forBooking)(req, res);
            return;
        });
    }
    static Init() {
        return new AppointmentBookingController_1();
    }
};
__decorate([
    Manager_1.TaskRunner.Bundle(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentBookingController.prototype, "verifyPayment", null);
__decorate([
    Manager_1.TaskRunner.Bundle(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentBookingController.prototype, "generateOrderId", null);
AppointmentBookingController = AppointmentBookingController_1 = __decorate([
    Manager_1.AutoBind,
    __metadata("design:paramtypes", [])
], AppointmentBookingController);
exports.AppointmentBookingController = AppointmentBookingController;
