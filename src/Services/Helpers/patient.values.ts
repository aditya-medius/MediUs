const config = require("../../config.json")
export enum AppointmentType {
    FRESH = config.Appointment.Type.Fresh,
    FOLLOW_UP = config.Appointment.Type.Follow_Up
}

export enum AppointmentStatus {
    PRESENT = config.Appointment.Status.Present,
    SCHEDULED = config.Appointment.Status.Scheduled,
    CONSULTED = config.Appointment.Status.Consulted,
    ABSENT = config.Appointment.Status.Absent
}

export const AppointStatusOrder = [
    config.Appointment.Status.Present,
    config.Appointment.Status.Scheduled,
    config.Appointment.Status.Consulted,
    config.Appointment.Status.Absent
]