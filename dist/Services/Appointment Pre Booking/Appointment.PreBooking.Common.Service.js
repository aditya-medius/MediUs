"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentPreBookingCommonService = void 0;
const Classes_1 = require("../../Classes");
class AppointmentPreBookingCommonService extends Classes_1.Base {
    doesDoctorHaveCapacityForWorkingHour(workingHour, capacityAndToken) {
        return workingHour.map((x, index) => ({ time: x, iscapacity: capacityAndToken[index].largestToken < capacityAndToken[index].capacity }));
    }
}
exports.AppointmentPreBookingCommonService = AppointmentPreBookingCommonService;
