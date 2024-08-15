import { Doctor } from "../Helpers"

export const formatDoctors = (doctors: Array<any>): Array<Doctor> => {
    const doctor: Array<Doctor> = doctors.map((doctor: any): Doctor => formatDoctor(doctor))
    return doctor
}

export const formatDoctor = (doctor: any) => {
    // console.log("Dsdssdsd", doctor)
    return {
        id: doctor?.id,
        name: `${doctor?.firstName} ${doctor.lastName}`,
        hospitals: doctor?.hospitalDetails,
        image: doctor?.image,
        verified: doctor?.verified,
        gender: doctor?.gender,
        DOB: doctor?.DOB,
        email: doctor?.email,
        deleted: doctor?.deleted,
        totalExperience: doctor?.totalExperience,
        overallExperience: doctor?.overallExperience,
        phoneNumberVerified: doctor?.phoneNumberVerified,
        lastTimePhoneNumberVerified: doctor?.lastTimePhoneNumberVerified
    }
}
