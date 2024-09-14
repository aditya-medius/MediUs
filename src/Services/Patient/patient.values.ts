import { Gender } from "../Helpers"

const config = require("../../../config.json")
export enum AppointmentType {
    FRESH = config.Appointment.Type.Fresh,
    FOLLOW_UP = config.Appointment.Type.Follow_Up
}

export enum AppointmentStatus {
    PRESENT = config.Appointment.Status.Present,
    SCHEDULED = config.Appointment.Status.Scheduled,
    CONSULTED = config.Appointment.Status.Consulted,
    ABSENT = config.Appointment.Status.Absent,
    ACCEPTED = config.Appointment.Status.Accepted
}

export const AppointStatusOrder = [
    config.Appointment.Status.Present,
    config.Appointment.Status.Accepted,
    config.Appointment.Status.Scheduled,
    config.Appointment.Status.Consulted,
    config.Appointment.Status.Absent
]

export interface Patient {
    id: string,
    name: string,
    image: string,
    verified: boolean,
    gender: Gender,
    DOB: Date,
    email: string,
    deleted: boolean,
    overallExperience: number,
    phoneNumberVerified: boolean,
    lastTimePhoneNumberVerified: Date
}