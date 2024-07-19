export enum AppointmentType {
    FRESH = "Fresh",
    FOLLOW_UP = "Follow Up"
}

export enum AppointmentStatus {
    SCHEDULED = "Scheduled",
    PRESENT = "Present",
    CONSULTED = "Consulted",
    ABSENT = "Absent"
}

export const AppointStatusOrder = ["Present", "Scheduled", "Consulted", "Absent",]