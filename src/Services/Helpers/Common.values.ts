const config = require("../../../config.json")
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
    HOSPITAL = config.common.UserType.hospital,
    DOCTOR = config.common.UserType.doctor,
    PATIENT = config.common.UserType.patient
}

export enum UserStatus {
    ACTIVE = config.common.UserStatus.active,
    ONHOLD = config.common.UserStatus.onhold,
    INACTIVE = config.common.UserStatus.inactive
}

export enum Gender {
    MALE = config.common.Gender.Male,
    FEMALE = config.common.Gender.Female
}

export type PromiseFunction<T extends Object> = () => Promise<T>