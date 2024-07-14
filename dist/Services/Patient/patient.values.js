"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentStatus = exports.AppointmentType = void 0;
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["FRESH"] = "Fresh";
    AppointmentType["FOLLOW_UP"] = "Follow Up";
})(AppointmentType = exports.AppointmentType || (exports.AppointmentType = {}));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "Scheduled";
    AppointmentStatus["PRESENT"] = "Present";
    AppointmentStatus["CONSULTED"] = "Consulted";
    AppointmentStatus["ABSENT"] = "Absent";
})(AppointmentStatus = exports.AppointmentStatus || (exports.AppointmentStatus = {}));
