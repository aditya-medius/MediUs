import { getPrescriptionValidityAndFeesOfDoctorInHospital } from "../../Controllers/Prescription-Validity.Controller"
import { ErrorFactory, ErrorTypes, ExceptionHandler } from "../../Handler"
import { checkIfDoctorTakesOverTheCounterPaymentsForAHospital } from "../Doctor/Doctor.Service"
import { DoctorScheduleDetails as DocSch, DoctorScheduleDetailsResponse as DocRes } from "../Helpers"
import { getAdvancedBookingPeriodForDoctor, setAdvancedBookingPeriodForDoctor, setConsultationFeeForDoctor, setPrescriptionValidityForDoctor, updateWorkingHoursCapacity } from "./Appointment.Schedule.Util"

const errorFactory = new ErrorFactory();

export const setAppointmentDetailsForDoctors = async (doctorScheduleDetails: DocSch) => {
    const { doctorId, hospitalId, validateTill, bookingPeriod, consultationFee } = doctorScheduleDetails
    const exceptionHandler = new ExceptionHandler<boolean>(async (): Promise<boolean> => {

        if (!(bookingPeriod && consultationFee && validateTill)) {
            errorFactory.invalidValueErrorMessage = "booking period, consultation fee, capacity"
            const errorMessage = errorFactory.invalidValueErrorMessage;
            throw errorFactory.createError(ErrorTypes.UnsupportedRequestBody, errorMessage)
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

export const updateWorkingHoursCapacityForDoctor = async (workingHourId: string, capacity: number): Promise<boolean> => {
    const exceptionHandler = new ExceptionHandler<boolean>(async (): Promise<boolean> => {
        if (!capacity || typeof capacity !== "number") {
            errorFactory.invalidValueErrorMessage = "capacity"
            const errorMessage = errorFactory.invalidValueErrorMessage;
            throw errorFactory.createError(ErrorTypes.UnsupportedRequestBody, errorMessage)
        }
        return await updateWorkingHoursCapacity(workingHourId, capacity)
    })

    return exceptionHandler.validateObjectIds(workingHourId).handleServiceExceptions();
}