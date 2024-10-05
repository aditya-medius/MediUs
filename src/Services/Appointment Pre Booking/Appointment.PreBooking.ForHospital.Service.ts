import { Base } from "../../Classes";
import { ErrorFactory, ValidationHandler } from "../../Handler";
import { TaskRunner } from "../../Manager";
import { IsAdvancedBookingPeriodValid } from "../../SchemaTypes";
import { AppointmentScheduleUtil } from "../Appointment Schedule";
import { checkIfDoctorTakesOverTheCounterPaymentsForAHospital } from "../Doctor/Doctor.Service";
import { ErrorTypes, HospitalExist, Weekdays } from "../Helpers";
import { doctorsInHospital, hospitalsInDoctor } from "../Hospital/Hospital.Service";
import { formatTime } from "../Utils";
import moment from "moment";
import { AppointmentPreBookingCommonService } from "./Appointment.PreBooking.Common.Service";
import { IAppointmentPreBookingForHospitalService } from "./IAppointment.PreBooking.ForHospital.Service";
import { provide } from "inversify-binding-decorators";

// @provide("IAppointmentPreBookingForHospitalService")
export class AppointmentPreBookingForHospitalService extends Base<AppointmentPreBookingForHospitalService> implements IAppointmentPreBookingForHospitalService {
    private appointmentScheduleUtil: AppointmentScheduleUtil = AppointmentScheduleUtil.Init(ValidationHandler.Init())
    private errorFactory: ErrorFactory = ErrorFactory.Init();

    constructor(private appointmentCommonService: AppointmentPreBookingCommonService) {
        super()
    }

    @TaskRunner.Bundle()
    async getAppointmentPreBookingDetails(hospitalId: string, timings: string) {
        let hospitals = await doctorsInHospital(hospitalId, timings);

        const doctorIdsStr: Array<string> = hospitals?.doctors.map((e: any) => {
            return e?._id?.toString()
        })
        let doesDoctorTakeOverTheCounterPaymentPromise = this.appointmentScheduleUtil.checkIfDoctorTakesOverTheCounterPaymentsForMultipleDoctors(hospitalId, doctorIdsStr)
        let advancedBookingPeriodPromise = this.appointmentScheduleUtil.getDoctorsAdvancedBookingPeriodForMultipleDoctors(hospitalId, doctorIdsStr)

        let [doesDoctorTakeOverTheCounterPayment, advancedBookingPeriod] = await Promise.all([doesDoctorTakeOverTheCounterPaymentPromise, advancedBookingPeriodPromise])


        let canDoctorTakeAppointment = this.appointmentScheduleUtil.checkIfAdvancedBookingPeriodValidForMultiplePeriods(moment(timings), advancedBookingPeriod);

        let day: number = new Date(timings).getDay();


        let doctorDetails = hospitals?.doctors?.map((e: any) =>
            this.doctorPreBookingDetails(e, hospitalId, day)
        )

        doctorDetails.forEach((doctor: any) => {
            // Check if the doctorId exists in canDoctorTakeAppointment
            const doctorCanTakeAppointment = canDoctorTakeAppointment.some(appointment => {
                if (appointment.doctorId.toString() == doctor.id.toString()) {
                    return appointment.valid
                }
            }
            );

            // Check if the doctorId exists in doesDoctorTakeOverTheCounterPayment
            const doctorOverTheCounterPayment = doesDoctorTakeOverTheCounterPayment.some(payment =>
                payment.doctor.toString() === doctor.id.toString()
            );

            // Set the values in doctordetails
            doctor.canDoctorAppointment = doctorCanTakeAppointment;
            doctor.overTheCounterPayment = doctorOverTheCounterPayment;
        });

        let hospitalDetails = this.hospitalPreBookingDetails(hospitals)
        return Promise.resolve({ doctorDetails, hospitalDetails })
    }

    private hospitalPreBookingDetails(hospitalDetails: any) {
        const address = hospitalDetails?.address;
        return {
            "_id": hospitalDetails?._id,
            "name": hospitalDetails?.name,
            "address": `${address?.locality?.name} ${address?.city?.name}`
        }
    }

    private doctorPreBookingDetails(doctor: any, hospitalId: string, day: number) {
        const doctorDetails: any = {
            id: doctor?._id,
            profileImage: doctor?.image,
            name: `${doctor?.firstName} ${doctor?.lastName}`,
            specilization: doctor?.specialization[0]?.specialityName,
            Qualification: doctor?.qualification[0]?.qualificationName?.abbreviation,
            Exeperience: doctor?.totalExperience ?? doctor?.overallExperience,
            Fee: doctor?.hospitalDetails.find(
                (elem: any) => elem.hospital.toString() === hospitalId
            )?.consultationFee.max,
            workinghour: doctor?.workingHours.map((elem: any) => {
                const appointmentStartTime = formatTime(`${elem[Weekdays[day]]?.from.time}:${elem[Weekdays[day]]?.from.division}`)
                const appointmentEndTime = formatTime(`${elem[Weekdays[day]]?.till.time}:${elem[Weekdays[day]]?.till.division}`)
                return `${appointmentStartTime} to ${appointmentEndTime}`;
            }),
            capacityAndToken: doctor?.workingHours.map((elem: any) => {
                return {
                    capacity: elem[Weekdays[day]].capacity,
                    largestToken: elem[Weekdays[day]].appointmentsBooked,
                };
            }),
            capacity: "",
            highestToken: "",
            available: doctor?.available,
            scheduleAvailable: doctor?.scheduleAvailable,
        };

        doctorDetails["slot"] = this.appointmentCommonService.doesDoctorHaveCapacityForWorkingHour(doctorDetails.workinghour, doctorDetails.capacityAndToken)
        return doctorDetails
    }
}