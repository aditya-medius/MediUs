const config = require("../../../config.json")
export interface Holiday {
    holiday: Array<Date>
}

export const Weekdays = [
    config.Weekdays.Sunday,
    config.Weekdays.Monday,
    config.Weekdays.Tuesday,
    config.Weekdays.Wednesday,
    config.Weekdays.Thursday,
    config.Weekdays.Friday,
    config.Weekdays.Saturday,
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


export enum ErrorMessage {
    invalidValueErrorMessage = config.Error.InvalidValueMessage,
    invalidTokenErrorMessage = config.Error.InvalidTokenErrorMessage,
    missingAuthToken = config.Error.MissingAuthToken
}