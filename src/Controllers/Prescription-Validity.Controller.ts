import { Request, Response } from "express";
import appointmentModel from "../Models/Appointment.Model";
import prescriptionValidityModel from "../Models/Prescription-Validity.Model";
import { errorResponse, successResponse } from "../Services/response";
import moment from "moment";

export const setPrescriptionValidity = async (req: Request, res: Response) => {
  try {
    let { doctorId, validateTill } = req.body;
    let prescription = await new prescriptionValidityModel({
      doctorId,
      validateTill,
    }).save();
    return successResponse(prescription, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const checkIfPatientAppointmentIsWithinPrescriptionValidityPeriod =
  async (body: any) => {
    try {
      let { doctorId, patientId, hospitalId } = body;
      const PV = await prescriptionValidityModel.findOne({
        doctorId,
      });

      const appointment = (
        await appointmentModel.aggregate([
          {
            $match: {
              patient: patientId,
              doctors: doctorId,
              hospital: hospitalId,
            },
          },
          {
            $sort: {
              "time.date": -1,
            },
          },
        ])
      )[0];
      if (PV) {
        // const date = new Date(appointment.time.date).getDate();
        const date = moment(
          new Date(appointment.time.date).getDate(),
          "DD.MM.YYYY"
        );
        const currentDate = moment(new Date(), "DD.MM.YYYY");
        let difference = date.diff(currentDate, "days");

        if (difference > PV.validateTill) {
          return Promise.reject(false);
        } else {
          return Promise.resolve(true);
        }
        return Promise.resolve(PV.validateTill);
      } else {
        return Promise.resolve(true);
      }
    } catch (error: any) {
      return Promise.reject(error);
    }
  };
