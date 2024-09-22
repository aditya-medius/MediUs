import { ExceptionHandler } from "../../Handler"
import prescriptionValidityModel from "../../Models/Prescription-Validity.Model"
import workingHourModel from "../../Models/WorkingHours.Model"
import * as doctorService from "../Doctor/Doctor.Service"
import { Weekdays } from "../Helpers"


export const setAdvancedBookingPeriodForDoctor = async (doctorId: string, hospitalId: string, bookingPeriod: number) => {
    const exceptionHandler = new ExceptionHandler(async () => {
        if (!bookingPeriod) {
            const error = new Error("Invalid values for booking period")
            throw error
        }
        const result = await doctorService.setDoctorsAdvancedBookingPeriod(doctorId, hospitalId, bookingPeriod)
        return Promise.resolve(result);
    })

    return await exceptionHandler.handleServiceExceptions()
}


export const setConsultationFeeForDoctor = async (doctorId: string, hospitalId: string, consultationFee: Object) => {
    const exceptionHandler = new ExceptionHandler(async () => {
        if (!consultationFee) {
            const error = new Error("Invalid consultation fee")
            throw error
        }
        let result = await doctorService.setConsultationFeeForDoctor(
            doctorId,
            hospitalId,
            consultationFee
        );
        return Promise.resolve(result)
    })

    return await exceptionHandler.handleServiceExceptions()
}



export const setPrescriptionValidityForDoctor = async (doctorId: string, hospitalId: string, validateTill: number) => {
    const exceptionHandler = new ExceptionHandler(async () => {
        if (!validateTill) {
            const error = new Error("Invalid validate till")
            throw error
        }
        let prescription = await prescriptionValidityModel.findOneAndUpdate(
            {
                doctorId,
                hospitalId,
            },
            {
                $set: {
                    validateTill,
                },
            },
            {
                new: true,
                upsert: true,
            }
        );
        return Promise.resolve(prescription)
    })

    return await exceptionHandler.handleServiceExceptions()
}

export const getAdvancedBookingPeriodForDoctor = async (doctorId: string, hospital: string) => {
    const exceptionHandler = new ExceptionHandler(async () => {
        const result = await doctorService.getDoctorsAdvancedBookingPeriod(doctorId, hospital)
        return Promise.resolve(result)
    })
    return await exceptionHandler.handleServiceExceptions();
}

export const updateWorkingHoursCapacity = async (workingHourId: string, capacity: number): Promise<boolean> => {
    const exceptionHandler = new ExceptionHandler<boolean>(async (): Promise<boolean> => {
        let workingHour = await workingHourModel.findOne({
            _id: workingHourId,
        });

        Object.keys(workingHour.toJSON()).forEach((elem: any) => {
            if (Weekdays.includes(elem)) {
                console.log("elem", elem)
                workingHour[elem].capacity = capacity
            }
        })

        await workingHour.save();
        return Promise.resolve(true)
    })

    return await exceptionHandler.handleServiceExceptions();
}