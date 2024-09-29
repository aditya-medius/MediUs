import express, { NextFunction, Request, Response } from "express";
import appointmentPreBookingRouter from "./Appointment.PreBooking.route";
import appointmentBookingRouter from "./Appointment.Booking.route";
import appointmentScheduleRouter from "./AppointmentSchedule.route";
const appointment = express.Router();

appointment.use("/prebooking", appointmentPreBookingRouter)

appointment.use("/schedule", appointmentScheduleRouter)

appointment.use("/book", appointmentBookingRouter)

export default appointment