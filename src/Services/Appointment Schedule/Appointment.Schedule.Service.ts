import { getPrescriptionValidityAndFeesOfDoctorInHospital } from "../../Controllers/Prescription-Validity.Controller"
import { ExceptionHandler } from "../../Handler"
import { checkIfDoctorTakesOverTheCounterPaymentsForAHospital } from "../Doctor/Doctor.Service"
import { DoctorScheduleDetails as DocSch, DoctorScheduleDetailsResponse as DocRes } from "../Helpers"
import { getAdvancedBookingPeriodForDoctor, setAdvancedBookingPeriodForDoctor, setConsultationFeeForDoctor, setPrescriptionValidityForDoctor } from "./Appointment.Schedule.Util"

export const setAppointmentDetailsForDoctors = async (doctorScheduleDetails: DocSch) => {
    const { doctorId, hospitalId, validateTill, bookingPeriod, consultationFee } = doctorScheduleDetails
    const exceptionHandler = new ExceptionHandler<boolean>(async (): Promise<boolean> => {

        if (!(bookingPeriod && consultationFee && validateTill)) {
            const error = new Error("Invalid values to update")
            throw error
        }

        await Promise.all([
            setAdvancedBookingPeriodForDoctor(doctorId, hospitalId, bookingPeriod),
            setConsultationFeeForDoctor(doctorId, hospitalId, consultationFee),
            setPrescriptionValidityForDoctor(doctorId, hospitalId, validateTill),
        ])

        return Promise.resolve(true)
    })

    return await exceptionHandler.validateObjectIds(doctorId, hospitalId).handleServiceExceptions()
}

export const getAppointmentDetailsForDoctors = async (doctorId: string, hospitalId: string): Promise<DocRes> => {

    const exceptionHandler = new ExceptionHandler<DocRes>(async (): Promise<DocRes> => {

        const [bookingPeriodRes, PrescipriptionValidityResAndConsultationFeeRes, acceptsOverTheCounterPayment] = await Promise.all([
            getAdvancedBookingPeriodForDoctor(doctorId, hospitalId),
            getPrescriptionValidityAndFeesOfDoctorInHospital(hospitalId, doctorId),
            checkIfDoctorTakesOverTheCounterPaymentsForAHospital(doctorId, hospitalId)
        ])

        const [prescriptionValidity, consultationFee] = PrescipriptionValidityResAndConsultationFeeRes

        return Promise.resolve({ bookingPeriod: bookingPeriodRes, doctorId, hospitalId, validateTill: prescriptionValidity?.prescription?.validateTill, consultationFee: consultationFee?.consultationFee, acceptsOverTheCounterPayment })
    })

    const result: DocRes = await exceptionHandler.validateObjectIds(doctorId, hospitalId).handleServiceExceptions()
    return result;
}