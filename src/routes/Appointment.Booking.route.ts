import express, { NextFunction, Request, Response } from "express";
import { oneOf } from "../Services/middlewareHelper";
import { authenticateHospital } from "../authentication/Hospital.auth";
import { checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod } from "../Controllers/Prescription-Validity.Controller";
import { AppointmentType } from "../Services/Helpers";
import { errorResponse } from "../Services/response";
import { authenticatePatient } from "../authentication/Patient.auth";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import { AppointmentBookingController } from "../Controllers";

const appointmentBookingRouter = express.Router();
const appointmentBookingController = AppointmentBookingController.Init()

appointmentBookingRouter.post(
    "/verifyPayment",
    oneOf(authenticateHospital),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let doctorId = req.body.doctors,
                patientId = req.body.patient,
                hospitalId = req.body.hospital,
                subPatientId = req.body.subPatient;
            let valid =
                await checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod({
                    doctorId,
                    patientId,
                    hospitalId,
                    subPatientId,
                });
            req.body["appointmentType"] = valid ? AppointmentType.FOLLOW_UP : AppointmentType.FRESH;

            if (req.currentHospital) {
                req.body.appointment["appointmentBookedBy"] = "Hospital";
            }

            req.body.appointment["appointmentType"] = req.body["appointmentType"]

            next();
        } catch (error: any) {
            return errorResponse(error, res);
        }
    },

    appointmentBookingController.verifyPayment
);


appointmentBookingRouter.post("/generateOrderId", oneOf(authenticatePatient, authenticateHospital, authenticateSuvedha), appointmentBookingController.generateOrderId);


export default appointmentBookingRouter