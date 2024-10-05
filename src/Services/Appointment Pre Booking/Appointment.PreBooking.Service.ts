import { Base } from "../../Classes";
import { ErrorFactory, ValidationHandler } from "../../Handler";
import { TaskRunner } from "../../Manager";
import { ErrorTypes, HospitalExist, Weekdays } from "../Helpers";
import { AppointmentPreBookingForPatientService } from "./Appointment.PreBooking.ForPatient.Service";
import { AppointmentPreBookingForHospitalService } from "./Appointment.PreBooking.ForHospital.Service";
import { inject } from "inversify";

export class AppointmentPreBookingService extends Base<AppointmentPreBookingService> {


    private errorFactory: ErrorFactory = ErrorFactory.Init();

    constructor(
        private appointmentPreBookingForPatient: AppointmentPreBookingForPatientService,
        private appointmentPreBookingForHospital: AppointmentPreBookingForHospitalService) {
        super()
    }

    @TaskRunner.Bundle()
    public async getAppointmentPreBookingDetailsForPatient(doctorId: string, timings: string) {
        if (typeof timings !== "string") {
            this.errorFactory.incorrectType = {
                value: "timing",
                incorrectType: typeof timings,
                correctType: "string"
            }
            throw this.errorFactory.createError(ErrorTypes.IncorrectType, this.errorFactory.incorrectType)
        }

        const { doctordetails, hospitaldetails } = await this.appointmentPreBookingForPatient.getAppointmentPreBookingDetails(doctorId, timings)
        return Promise.resolve({ doctordetails, hospitaldetails })
    }

    @TaskRunner.Bundle()
    async getAppointmentPreBookingDetailsForHospital(hospitalId: string, timings: string) {
        if (typeof timings !== "string") {
            this.errorFactory.incorrectType = {
                value: "timing",
                incorrectType: typeof timings,
                correctType: "string"
            }
            throw this.errorFactory.createError(ErrorTypes.IncorrectType, this.errorFactory.incorrectType)
        }
        const { doctorDetails, hospitalDetails } = await this.appointmentPreBookingForHospital.getAppointmentPreBookingDetails(hospitalId, timings);
        return Promise.resolve({ doctorDetails, hospitalDetails })
    }
}