import { UserStatus } from "./Common.enum";
import { Doctor } from "./Doctor.values";

export interface Hospital {
    id: string,
    name: string,
    lastLogin: Date,
    doctors?: Array<Doctor>,
    status: UserStatus,
    verified: boolean,
    contactNumber: string,
    type: string,
    phoneNumberVerified: boolean,
    lastTimePhoneNumberVerified: Date,
}