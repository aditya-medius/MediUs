"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointStatusOrder = exports.AppointmentStatus = exports.AppointmentType = void 0;
const config = require("../../../config.json");
var AppointmentType;
(function (AppointmentType) {
    AppointmentType[AppointmentType["FRESH"] = config.Appointment.Type.Fresh] = "FRESH";
    AppointmentType[AppointmentType["FOLLOW_UP"] = config.Appointment.Type.Follow_Up] = "FOLLOW_UP";
})(AppointmentType = exports.AppointmentType || (exports.AppointmentType = {}));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus[AppointmentStatus["PRESENT"] = config.Appointment.Status.Present] = "PRESENT";
    AppointmentStatus[AppointmentStatus["SCHEDULED"] = config.Appointment.Status.Scheduled] = "SCHEDULED";
    AppointmentStatus[AppointmentStatus["CONSULTED"] = config.Appointment.Status.Consulted] = "CONSULTED";
    AppointmentStatus[AppointmentStatus["ABSENT"] = config.Appointment.Status.Absent] = "ABSENT";
})(AppointmentStatus = exports.AppointmentStatus || (exports.AppointmentStatus = {}));
exports.AppointStatusOrder = [
    config.Appointment.Status.Present,
    config.Appointment.Status.Scheduled,
    config.Appointment.Status.Consulted,
    config.Appointment.Status.Absent
];
