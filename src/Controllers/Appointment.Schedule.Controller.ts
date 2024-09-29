import { Request, Response } from "express";
import { AppointmentScheduleService } from "../Services/Appointment Schedule";
import { DoctorScheduleDetails } from "../Services/Helpers";
import { AutoBind, TaskManager, TaskRunner } from "../Manager";
import { Base } from "../Classes";

@AutoBind
export class AppointmentScheduleController implements Base<AppointmentScheduleController> {
    private readonly appointmentScheduleService = new AppointmentScheduleService();

    constructor() {
    }

    Init = (): AppointmentScheduleController => new AppointmentScheduleController();

    @TaskRunner.Bundle(true)
    async setDoctorsAppointmentDetails(req: Request, res: Response) {
        const { doctorId, hospitalId, bookingPeriod, consultationFee, validateTill } = req.body;
        const doctorScheduleDetails: DoctorScheduleDetails = {
            doctorId,
            hospitalId,
            consultationFee,
            validateTill,
            bookingPeriod,
        };
        return await this.appointmentScheduleService.setAppointmentDetailsForDoctors(doctorScheduleDetails);
    }

    @TaskRunner.Bundle(true)
    async getDoctorsAppointmentDetails(req: Request, res: Response) {
        const taskManager = new TaskManager(async () => {
            const { doctorId, hospitalId } = req.query
            return await this.appointmentScheduleService.getAppointmentDetailsForDoctors(doctorId as string, hospitalId as string)
        })
        return await taskManager.execute(req, res)
    }

    @TaskRunner.Bundle(true)
    async updateWorkingHoursCapacity(req: Request, res: Response) {
        const taskManager = new TaskManager(async () => {
            const { workingHourId, capacity } = req.body
            return await this.appointmentScheduleService.updateWorkingHoursCapacityForDoctor(workingHourId, capacity)
        })

        return await taskManager.execute(req, res)
    }
}
