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
var AppointmentScheduleController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentScheduleController = void 0;
const Appointment_Schedule_1 = require("../Services/Appointment Schedule");
const Manager_1 = require("../Manager");
let AppointmentScheduleController = AppointmentScheduleController_1 = class AppointmentScheduleController {
    constructor() {
        this.appointmentScheduleService = new Appointment_Schedule_1.AppointmentScheduleService();
        this.Init = () => new AppointmentScheduleController_1();
    }
    setDoctorsAppointmentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId, hospitalId, bookingPeriod, consultationFee, validateTill } = req.body;
            const doctorScheduleDetails = {
                doctorId,
                hospitalId,
                consultationFee,
                validateTill,
                bookingPeriod,
            };
            return yield this.appointmentScheduleService.setAppointmentDetailsForDoctors(doctorScheduleDetails);
        });
    }
    getDoctorsAppointmentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskManager = new Manager_1.TaskManager(() => __awaiter(this, void 0, void 0, function* () {
                const { doctorId, hospitalId } = req.query;
                return yield this.appointmentScheduleService.getAppointmentDetailsForDoctors(doctorId, hospitalId);
            }));
            return yield taskManager.execute(req, res);
        });
    }
    updateWorkingHoursCapacity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskManager = new Manager_1.TaskManager(() => __awaiter(this, void 0, void 0, function* () {
                const { workingHourId, capacity } = req.body;
                return yield this.appointmentScheduleService.updateWorkingHoursCapacityForDoctor(workingHourId, capacity);
            }));
            return yield taskManager.execute(req, res);
        });
    }
};
__decorate([
    Manager_1.TaskRunner.Bundle(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentScheduleController.prototype, "setDoctorsAppointmentDetails", null);
__decorate([
    Manager_1.TaskRunner.Bundle(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentScheduleController.prototype, "getDoctorsAppointmentDetails", null);
__decorate([
    Manager_1.TaskRunner.Bundle(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentScheduleController.prototype, "updateWorkingHoursCapacity", null);
AppointmentScheduleController = AppointmentScheduleController_1 = __decorate([
    Manager_1.AutoBind,
    __metadata("design:paramtypes", [])
], AppointmentScheduleController);
exports.AppointmentScheduleController = AppointmentScheduleController;
