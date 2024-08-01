export interface Holiday {
    holiday: Array<Date>
}

export const Weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

export interface offDatesAndDays {
    offDays: Array<string>, // Days
    offDates: Array<string> // Dates
}

export enum UserType {
    HOSPITAL = "hospital",
    DOCTOR = "doctor",
    PATIENT = "patient"
}

export enum UserStatus{
    ACTIVE = "active",
    ONHOLD = "onhold",
    INACTIVE = "inactive"
}