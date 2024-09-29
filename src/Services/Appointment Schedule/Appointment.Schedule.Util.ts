import moment from "moment"
import { Base } from "../../Classes"
import { ErrorFactory, ValidationHandler } from "../../Handler"
import { TaskRunner } from "../../Manager"
import advancedBookingPeriodModel from "../../Models/AdvancedBookingPeriod"
import overTheCounterModel from "../../Models/OverTheCounterPayment"
import prescriptionValidityModel from "../../Models/Prescription-Validity.Model"
import workingHourModel from "../../Models/WorkingHours.Model"
import { AdvancedBookingPeriod, IsAdvancedBookingPeriodValid, OverTheCounterPayment } from "../../SchemaTypes"
import * as doctorService from "../Doctor/Doctor.Service"
import { ErrorTypes, HospitalExist, Weekdays } from "../Helpers"
import { isAdvancedBookingValid } from "../Patient/Patient.Service"

const errorFactory = new ErrorFactory()
export class AppointmentScheduleUtil extends Base<AppointmentScheduleUtil> {
    private readonly validationHandler;
    constructor(_validationHandler: ValidationHandler) {
        super()
        this.validationHandler = _validationHandler
    }

    @TaskRunner.Bundle()
    async setAdvancedBookingPeriodForDoctor(doctorId: string, hospitalId: string, bookingPeriod: number) {
        if (!bookingPeriod) {
            const error = new Error("Invalid values for booking period")
            throw error
        }

        this.validationHandler.validateObjectIds(doctorId, hospitalId)

        if (typeof bookingPeriod !== "number") {
            errorFactory.incorrectType = { value: "bookingPeriod", incorrectType: typeof bookingPeriod, correctType: "number" }
            const errorMessage = errorFactory.incorrectType;
            throw errorFactory.createError(ErrorTypes.IncorrectType, errorMessage)
        }
        const result = await doctorService.setDoctorsAdvancedBookingPeriod(doctorId, hospitalId, bookingPeriod)
        return Promise.resolve(result);
    }

    @TaskRunner.Bundle()
    async setConsultationFeeForDoctor(doctorId: string, hospitalId: string, consultationFee: Object) {

        this.validationHandler.validateObjectIds(doctorId, hospitalId)

        if (!consultationFee) {
            const error = new Error("Invalid consultation fee")
            throw error
        }

        if (typeof consultationFee !== "object") {
            errorFactory.incorrectType = { value: "consultationFee", incorrectType: typeof consultationFee, correctType: "number" }
            const errorMessage = errorFactory.incorrectType;
            throw errorFactory.createError(ErrorTypes.IncorrectType, errorMessage)
        }

        let result = await doctorService.setConsultationFeeForDoctor(
            doctorId,
            hospitalId,
            consultationFee
        );
        return Promise.resolve(result)
    }

    @TaskRunner.Bundle()
    async setPrescriptionValidityForDoctor(doctorId: string, hospitalId: string, validateTill: number) {
        if (!validateTill) {
            const error = new Error("Invalid validate till")
            throw error
        }
        this.validationHandler.validateObjectIds(doctorId, hospitalId)

        if (typeof validateTill !== "number") {
            errorFactory.incorrectType = { value: "validateTill", incorrectType: typeof validateTill, correctType: "number" }
            const errorMessage = errorFactory.incorrectType;
            throw errorFactory.createError(ErrorTypes.IncorrectType, errorMessage)
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
    }

    @TaskRunner.Bundle()
    async getAdvancedBookingPeriodForDoctor(doctorId: string, hospitalId: string) {
        this.validationHandler.validateObjectIds(doctorId, hospitalId)
        const result = await doctorService.getDoctorsAdvancedBookingPeriod(doctorId, hospitalId)
        return Promise.resolve(result)
    }

    @TaskRunner.Bundle()
    async updateWorkingHoursCapacity(workingHourId: string, capacity: number): Promise<boolean> {
        let workingHour = await workingHourModel.findOne({
            _id: workingHourId,
        });

        Object.keys(workingHour.toJSON()).forEach((elem: any) => {
            if (Weekdays.includes(elem)) {
                workingHour[elem].capacity = capacity
            }
        })

        await workingHour.save();
        return Promise.resolve(true)
    }

    @TaskRunner.Bundle()
    async checkIfDoctorTakesOverTheCounterPaymentsForMultipleHospital(doctorId: string, hospitalIds: Array<string>): Promise<Array<HospitalExist>> {
        this.validationHandler.validateObjectIds(doctorId, ...hospitalIds);

        const payments = await overTheCounterModel.find({ doctorId, hospitalId: { $in: hospitalIds } }).lean() as Array<OverTheCounterPayment>
        const result = payments?.map((data: OverTheCounterPayment) => {

            let mapData: HospitalExist = { hospital: data.hospitalId.toString() }
            if (hospitalIds.includes(data?.hospitalId?.toString())) {
                mapData["exist"] = true
            } else {
                mapData["exist"] = false
            }
            return mapData
        })
        return Promise.resolve(result)
    }

    @TaskRunner.Bundle()
    async getDoctorsAdvancedBookingPeriodForMultipleHospitals(doctorId: string, hospitalIds: Array<string>): Promise<AdvancedBookingPeriod[]> {
        this.validationHandler.validateObjectIds(doctorId, ...hospitalIds);
        let bookingPeriodRecord: AdvancedBookingPeriod[] = await advancedBookingPeriodModel.find({ doctorId, hospitalId: { $in: hospitalIds } }).lean() as AdvancedBookingPeriod[]
        return Promise.resolve(bookingPeriodRecord)
    }

    checkIfAdvancedBookingPeriodValidForMultiplePeriods(bookingDate: moment.Moment, bookingPeriod: AdvancedBookingPeriod[]): IsAdvancedBookingPeriodValid[] {
        const isValidPeriod: IsAdvancedBookingPeriodValid[] = bookingPeriod.map((period: AdvancedBookingPeriod) => {
            const validStatus: IsAdvancedBookingPeriodValid = { ...period, valid: isAdvancedBookingValid(bookingDate, period.bookingPeriod) }
            return validStatus
        })
        return isValidPeriod
    }
}
