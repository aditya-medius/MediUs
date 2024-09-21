export type DoctorScheduleDetails = {
    doctorId: string,
    hospitalId: string,
    consultationFee: number,
    bookingPeriod: number,
    validateTill: number
}

export type DoctorScheduleDetailsResponse = DoctorScheduleDetails | { acceptsOverTheCounterPayment: boolean }