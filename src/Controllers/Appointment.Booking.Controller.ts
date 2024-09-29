import { Request, Response } from "express";
import { generateOrderId_forBooking, verifyPayment_forBooking } from "../Services/Appointment Booking";
import { AutoBind, TaskRunner } from "../Manager";


@AutoBind
export class AppointmentBookingController {
    constructor() { }

    @TaskRunner.Bundle(true)
    async verifyPayment(req: Request, res: Response) {
        verifyPayment_forBooking(req, res)
        return;
    }

    @TaskRunner.Bundle(true)
    async generateOrderId(req: Request, res: Response) {
        generateOrderId_forBooking(req, res)
        return
    }

    static Init() {
        return new AppointmentBookingController()
    }
}