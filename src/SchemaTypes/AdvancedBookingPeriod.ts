export type AdvancedBookingPeriod = {
    doctorId: string,
    hospitalId: string,
    bookingPeriod: number,
    createdAt: Date
}

export type IsAdvancedBookingPeriodValid = AdvancedBookingPeriod & {
    valid: boolean
}