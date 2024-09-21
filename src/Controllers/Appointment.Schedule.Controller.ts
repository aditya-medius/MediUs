import { Request, Response } from "express";
import { errorResponse, successResponse } from "../Services/response";
import { getAppointmentDetailsForDoctors, setAppointmentDetailsForDoctors } from "../Services/Appointment Schedule";
import { DoctorScheduleDetails } from "../Services/Helpers";
import { ExceptionHandler } from "../Handler";

export const setDoctorsAppointmentDetails = async (req: Request, res: Response) => {
    const exceptionHandler = new ExceptionHandler(async () => {
        const { doctorId, hospitalId, bookingPeriod, consultationFee, validateTill } = req.body
        const doctorScheduleDetials: DoctorScheduleDetails = {
            doctorId,
            hospitalId,
            consultationFee: consultationFee?.max,
            validateTill,
            bookingPeriod
        }
        return await setAppointmentDetailsForDoctors(doctorScheduleDetials)
    })

    return await exceptionHandler.handleResponseException(req, res)
}

export const getDoctorsAppointmentDetails = async (req: Request, res: Response) => {
    const exceptionHandler = new ExceptionHandler(async () => {
        const { doctorId, hospitalId } = req.query
        return await getAppointmentDetailsForDoctors(doctorId as string, hospitalId as string)
    })
    return await exceptionHandler.handleResponseException(req, res)
}
