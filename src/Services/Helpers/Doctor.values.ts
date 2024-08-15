import { Gender } from "./Common.values";
import { Hospital } from "./Hospital.values";

export interface Doctor {
    id: string,
    name: string,
    hospitals?: Array<Hospital>,
    image: string,
    verified: boolean,
    gender: Gender,
    DOB: Date,
    email: string,
    deleted: boolean,
    totalExperience: number,
    overallExperience: number,
    lastTimePhoneNumberVerified: Date
}