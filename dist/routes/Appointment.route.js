"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Appointment_PreBooking_route_1 = __importDefault(require("./Appointment.PreBooking.route"));
const Appointment_Booking_route_1 = __importDefault(require("./Appointment.Booking.route"));
const AppointmentSchedule_route_1 = __importDefault(require("./AppointmentSchedule.route"));
const appointment = express_1.default.Router();
appointment.use("/prebooking", Appointment_PreBooking_route_1.default);
appointment.use("/schedule", AppointmentSchedule_route_1.default);
appointment.use("/book", Appointment_Booking_route_1.default);
exports.default = appointment;
