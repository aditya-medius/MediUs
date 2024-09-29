import { Request, Response } from "express";
import { Base } from "../Classes";
import { AutoBind, TaskRunner } from "../Manager";
import { AppointmentPreBookingService } from "../Services/Appointment Pre Booking";

@AutoBind
export class AppointmentPreBooking extends Base<AppointmentPreBooking> {
    constructor(private appointmentPreBookingService: AppointmentPreBookingService) {
        super();
    }


    @TaskRunner.Bundle(true)
    async details(req: Request, res: Response) {
        const { doctorId } = req.params
        const { timings } = req.query
        const preBookingDetails = await this.appointmentPreBookingService.getAppointmentPreBookingDetails(doctorId, timings as string)
        return Promise.resolve(preBookingDetails);
    }
}