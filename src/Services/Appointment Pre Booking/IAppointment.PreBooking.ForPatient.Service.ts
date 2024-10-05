export interface IAppointmentPreBookingForPatientService {
    getAppointmentPreBookingDetails: (doctorId: string, timings: string) => Promise<any>
}