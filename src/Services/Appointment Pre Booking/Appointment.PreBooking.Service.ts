import { Base } from "../../Classes";
import { ErrorFactory, ValidationHandler } from "../../Handler";
import { TaskRunner } from "../../Manager";
import { IsAdvancedBookingPeriodValid } from "../../SchemaTypes";
import { AppointmentScheduleUtil } from "../Appointment Schedule";
import { checkIfDoctorTakesOverTheCounterPaymentsForAHospital } from "../Doctor/Doctor.Service";
import { ErrorTypes, HospitalExist, Weekdays } from "../Helpers";
import { hospitalsInDoctor } from "../Hospital/Hospital.Service";
import { formatTime } from "../Utils";
import moment from "moment";

export class AppointmentPreBookingService extends Base<AppointmentPreBookingService> {


    private appointmentScheduleUtil: AppointmentScheduleUtil = AppointmentScheduleUtil.Init(ValidationHandler.Init())
    private errorFactory: ErrorFactory = ErrorFactory.Init();

    constructor() {
        super()
    }

    @TaskRunner.Bundle()
    public async getAppointmentPreBookingDetails(doctorId: string, timings: string) {
        if (typeof timings !== "string") {
            this.errorFactory.incorrectType = {
                value: "timing",
                incorrectType: typeof timings,
                correctType: "string"
            }
            throw this.errorFactory.createError(ErrorTypes.IncorrectType, this.errorFactory.incorrectType)
        }

        let doctors = await hospitalsInDoctor(doctorId, timings);
        const hospitalIds: Array<any> = doctors?.hospitalDetails.map((e: any) => {
            let data = e?.hospital;
            return {
                id: data?._id,
            }
        })

        const hospitalIdStr = hospitalIds.map((data: any) => data?.id?.toString())

        let doesDoctorTakeOverTheCounterPaymentPromise = this.appointmentScheduleUtil.checkIfDoctorTakesOverTheCounterPaymentsForMultipleHospital(doctorId, hospitalIdStr)
        let advancedBookingPeriodPromise = this.appointmentScheduleUtil.getDoctorsAdvancedBookingPeriodForMultipleHospitals(doctorId, hospitalIdStr)

        let [doesDoctorTakeOverTheCounterPayment, advancedBookingPeriod] = await Promise.all([doesDoctorTakeOverTheCounterPaymentPromise, advancedBookingPeriodPromise])


        let canDoctorTakeAppointment = this.appointmentScheduleUtil.checkIfAdvancedBookingPeriodValidForMultiplePeriods(moment(timings), advancedBookingPeriod);

        let day: number = new Date(timings).getDay();
        let doctordetails = this.doctorPreBookingDetails(doctors)

        let hospitaldetails = doctors?.hospitalDetails.map((e: any) =>
            this.hospitalPreBookingDetails(e, day));

        hospitaldetails.forEach((hospital: any) => {
            // Check if the hospitalId exists in canDoctorTakeAppointment
            const doctorCanTakeAppointment = canDoctorTakeAppointment.some(appointment => {
                if (appointment.hospitalId.toString() == hospital.id.toString()) {
                    return appointment.valid
                }
            }
            );

            // Check if the hospitalId exists in doesDoctorTakeOverTheCounterPayment
            const doctorOverTheCounterPayment = doesDoctorTakeOverTheCounterPayment.some(payment =>
                payment.hospital.toString() === hospital.id.toString()
            );

            // Set the values in hospitaldetails
            hospital.canDoctorAppointment = doctorCanTakeAppointment;
            hospital.overTheCounterPayment = doctorOverTheCounterPayment;
        });

        return Promise.resolve({ doctordetails, hospitaldetails })
    }

    private hospitalPreBookingDetails(allHospitalDetails: any, day: number) {
        let data = allHospitalDetails?.hospital;
        const bookingDetailsForHospital: any = {
            id: data?._id,
            name: data?.name,
            address: `${data?.address?.locality?.name}, ${data?.address?.city?.name}`,
            fee: allHospitalDetails?.consultationFee?.min,
            prescription_validity: allHospitalDetails?.prescription?.validateTill,
            time: allHospitalDetails?.workingHours?.map((elem: any) => {
                const appointmentStartTime = formatTime(`${elem[Weekdays[day]]?.from.time}:${elem[Weekdays[day]]?.from.division}`)
                const appointmentEndTime = formatTime(`${elem[Weekdays[day]]?.till.time}:${elem[Weekdays[day]]?.till.division}`)
                return `${appointmentStartTime} to ${appointmentEndTime}`;
            }),

            capacityAndToken: allHospitalDetails?.workingHours.map((elem: any) => {
                return {
                    capacity: elem[Weekdays[day]].capacity,
                    largestToken: elem[Weekdays[day]].appointmentsBooked,
                };
            }),
            available: allHospitalDetails?.available,
            scheduleAvailable: allHospitalDetails?.scheduleAvailable,
            lat: data?.lat,
            lng: data?.lng,
            contactNumber: data?.contactNumber,
            status: data?.status,
            profileImage: data?.profileImage,
        };

        bookingDetailsForHospital["slot"] = this.doesDoctorHaveCapacityForWorkingHour(bookingDetailsForHospital.time, bookingDetailsForHospital.capacityAndToken)
        return bookingDetailsForHospital;
    }

    private doctorPreBookingDetails(allDoctorDetails: any) {
        return {
            _id: allDoctorDetails?._id,
            name: `${allDoctorDetails.firstName} ${allDoctorDetails.lastName}`,
            specilization: allDoctorDetails?.specialization?.[0]?.specialityName,
            qualification: allDoctorDetails?.qualification?.[0]?.qualificationName?.name,
            experience: allDoctorDetails?.overallExperience,
        }
    }

    private doesDoctorHaveCapacityForWorkingHour(
        workingHour: Array<string>,
        capacityAndToken: Array<{
            capacity: number,
            largestToken: number
        }>) {
        return workingHour.map((x: string, index: number) =>
            ({ time: x, iscapacity: capacityAndToken[index].largestToken < capacityAndToken[index].capacity })
        )
    }
}