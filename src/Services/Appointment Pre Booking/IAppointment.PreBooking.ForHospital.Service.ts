export interface IAppointmentPreBookingForHospitalService {
    getAppointmentPreBookingDetails: (doctorId: string, timings: string) => Promise<any>
}