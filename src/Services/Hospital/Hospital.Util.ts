import { Hospital } from "../Helpers";

export const formatHospitals = (hospitals: Array<any>): Array<Hospital> => {
    const hospital: Array<Hospital> = hospitals.map((hospital: any): Hospital => formatHospital(hospital))
    return hospital
}

export const formatHospital = (hospital: any): Hospital => {
    return {
        id: hospital?.id,
        name: hospital?.name,
        lastLogin: hospital?.lastLogin,
        doctors: hospital?.doctors,
        status: hospital?.status,
        verified: hospital?.verified,
        contactNumber: hospital?.contactNumber,
        type: hospital?.type,
        phoneNumberVerified: hospital?.phoneNumberVerified,
        lastTimePhoneNumberVerified: hospital?.lastTimePhoneNumberVerified,
    }
}
