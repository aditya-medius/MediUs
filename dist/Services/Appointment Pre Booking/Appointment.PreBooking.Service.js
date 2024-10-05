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
exports.AppointmentPreBookingService = void 0;
const Classes_1 = require("../../Classes");
const Handler_1 = require("../../Handler");
const Manager_1 = require("../../Manager");
const Helpers_1 = require("../Helpers");
class AppointmentPreBookingService extends Classes_1.Base {
    constructor(appointmentPreBookingForPatient, appointmentPreBookingForHospital) {
        super();
        this.appointmentPreBookingForPatient = appointmentPreBookingForPatient;
        this.appointmentPreBookingForHospital = appointmentPreBookingForHospital;
        this.errorFactory = Handler_1.ErrorFactory.Init();
    }
    getAppointmentPreBookingDetailsForPatient(doctorId, timings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof timings !== "string") {
                this.errorFactory.incorrectType = {
                    value: "timing",
                    incorrectType: typeof timings,
                    correctType: "string"
                };
                throw this.errorFactory.createError(Helpers_1.ErrorTypes.IncorrectType, this.errorFactory.incorrectType);
            }
            const { doctordetails, hospitaldetails } = yield this.appointmentPreBookingForPatient.getAppointmentPreBookingDetails(doctorId, timings);
            return Promise.resolve({ doctordetails, hospitaldetails });
        });
    }
    getAppointmentPreBookingDetailsForHospital(hospitalId, timings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof timings !== "string") {
                this.errorFactory.incorrectType = {
                    value: "timing",
                    incorrectType: typeof timings,
                    correctType: "string"
                };
                throw this.errorFactory.createError(Helpers_1.ErrorTypes.IncorrectType, this.errorFactory.incorrectType);
            }
            const { doctorDetails, hospitalDetails } = yield this.appointmentPreBookingForHospital.getAppointmentPreBookingDetails(hospitalId, timings);
            return Promise.resolve({ doctorDetails, hospitalDetails });
        });
    }
}
__decorate([
    Manager_1.TaskRunner.Bundle(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentPreBookingService.prototype, "getAppointmentPreBookingDetailsForPatient", null);
__decorate([
    Manager_1.TaskRunner.Bundle(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentPreBookingService.prototype, "getAppointmentPreBookingDetailsForHospital", null);
exports.AppointmentPreBookingService = AppointmentPreBookingService;
