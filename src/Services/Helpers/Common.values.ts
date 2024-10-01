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

export type PromiseFunction<T extends Object> = () => Promise<T>

export type HospitalExist = {
    hospital: string,
    exist?: boolean
}

export type DoctorExist = {
    doctor: string,
    exist: boolean
}