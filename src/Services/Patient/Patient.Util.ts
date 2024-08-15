import { Patient } from "../Helpers"

export const formatPatients = (doctors: Array<any>): Array<Patient> => {
    const patient: Array<Patient> = doctors.map((patient: any): Patient => formatPatient(patient))
    return patient
}

export const formatPatient = (patient: any): Patient => {
    return {
        id: patient?.id,
        name: `${patient?.firstName} ${patient.lastName}`,
        image: patient?.image,
        verified: patient?.verified,
        gender: patient?.gender,
        DOB: patient?.DOB,
        email: patient?.email,
        deleted: patient?.deleted,
        overallExperience: patient?.overallExperience,
        phoneNumberVerified: patient?.phoneNumberVerified,
        lastTimePhoneNumberVerified: patient?.lastTimePhoneNumberVerified
    }
}
