import e, { Request, Response } from "express";
import * as hospitalController from "../../Controllers/Hospital.Controller";
import * as paymentController from "../../Controllers/AppointmentPayment.Controller";
import { TaskManager } from "../../Manager";

export const verifyPayment_forBooking = async (req: Request, res: Response) => {
    const taskManager = new TaskManager(async () => {
        await hospitalController.verifyPayment(req, res);
        return true;
    })
    taskManager.callback();
}

export const generateOrderId_forBooking = async (req: Request, res: Response) => {
    const taskManager = new TaskManager(async () => {
        await paymentController.generateOrderId(req, res);
        return true;
    })

    taskManager.callback()

}