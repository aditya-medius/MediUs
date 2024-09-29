import { Base } from "../../Classes"
import { getPrescriptionValidityAndFeesOfDoctorInHospital } from "../../Controllers/Prescription-Validity.Controller"
import { ErrorFactory, ValidationHandler } from "../../Handler"
import { TaskRunner } from "../../Manager"
import { checkIfDoctorTakesOverTheCounterPaymentsForAHospital } from "../Doctor/Doctor.Service"
import { DoctorScheduleDetails as DocSch, DoctorScheduleDetailsResponse as DocRes, ErrorTypes } from "../Helpers"
import { AppointmentScheduleUtil } from "./Appointment.Schedule.Util"

const errorFactory = new ErrorFactory();

export class AppointmentScheduleService implements Base<AppointmentScheduleService> {
    private readonly appointmentScheduleUtil: AppointmentScheduleUtil
    private readonly validationHandler: ValidationHandler = new ValidationHandler();

    constructor() {
        this.appointmentScheduleUtil = new AppointmentScheduleUtil(this.validationHandler)
    }

    Init = (): AppointmentScheduleService => new AppointmentScheduleService();

    @TaskRunner.Bundle()
    async setAppointmentDetailsForDoctors(doctorScheduleDetails: DocSch) {

        const { doctorId, hospitalId, validateTill, bookingPeriod, consultationFee } = doctorScheduleDetails

        this.validationHandler.validateObjectIds(doctorId, hospitalId)

        if (!(bookingPeriod && consultationFee && validateTill)) {
            errorFactory.invalidValueErrorMessage = "booking period, consultation fee, capacity"
            const errorMessage = errorFactory.invalidValueErrorMessage;
            throw errorFactory.createError(ErrorTypes.UnsupportedRequestBody, errorMessage)
        }

        await Promise.all([
            this.appointmentScheduleUtil.setAdvancedBookingPeriodForDoctor(doctorId, hospitalId, bookingPeriod),
            this.appointmentScheduleUtil.setConsultationFeeForDoctor(doctorId, hospitalId, consultationFee),
            this.appointmentScheduleUtil.setPrescriptionValidityForDoctor(doctorId, hospitalId, validateTill),
        ])

        return Promise.resolve(true)
    }

    @TaskRunner.Bundle()
    async getAppointmentDetailsForDoctors(doctorId: string, hospitalId: string): Promise<DocRes> {
        this.validationHandler.validateObjectIds(doctorId, hospitalId)

        const [bookingPeriodRes, PrescipriptionValidityResAndConsultationFeeRes, acceptsOverTheCounterPayment] = await Promise.all([
            this.appointmentScheduleUtil.getAdvancedBookingPeriodForDoctor(doctorId, hospitalId),
            getPrescriptionValidityAndFeesOfDoctorInHospital(hospitalId, doctorId),
            checkIfDoctorTakesOverTheCounterPaymentsForAHospital(doctorId, hospitalId)
        ])
        let [prescriptionValidity, consultationFee] = PrescipriptionValidityResAndConsultationFeeRes
        return Promise.resolve({ bookingPeriod: bookingPeriodRes, doctorId, hospitalId, validateTill: prescriptionValidity?.prescription[0]?.validateTill, consultationFee: consultationFee?.consultationFee?.max, acceptsOverTheCounterPayment })
    }

    @TaskRunner.Bundle()
    async updateWorkingHoursCapacityForDoctor(workingHourId: string, capacity: number): Promise<boolean> {
        if (!capacity || typeof capacity !== "number") {
            errorFactory.invalidValueErrorMessage = "capacity"
            const errorMessage = errorFactory.invalidValueErrorMessage;
            throw errorFactory.createError(ErrorTypes.UnsupportedRequestBody, errorMessage)
        }
        return await this.appointmentScheduleUtil.updateWorkingHoursCapacity(workingHourId, capacity)
    }
}
