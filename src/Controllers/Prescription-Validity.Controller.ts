import { Request, Response } from "express";
import appointmentModel from "../Models/Appointment.Model";
import prescriptionValidityModel from "../Models/Prescription-Validity.Model";
import { errorResponse, successResponse } from "../Services/response";
import moment from "moment";
import mongoose from "mongoose";
export const setPrescriptionValidity = async (req: Request, res: Response) => {
  try {
    let { doctorId = req.currentDoctor, validateTill, hospitalId } = req.body;
    let prescription = await new prescriptionValidityModel({
      doctorId,
      hospitalId,
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
      let { doctorId, patientId, hospitalId, subPatientId } = body;
      const PV = await prescriptionValidityModel.findOne({
        doctorId,
      });
      let appointment = (
        await appointmentModel.aggregate([
          {
            $match: {
              patient: new mongoose.Types.ObjectId(patientId),
              doctors: new mongoose.Types.ObjectId(doctorId),
              hospital: new mongoose.Types.ObjectId(hospitalId),
              subPatient: new mongoose.Types.ObjectId(subPatientId),
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
        if (appointment) {
          const date = moment(appointment.time.date, "DD.MM.YYY");
          const currentDate = moment(new Date(), "DD.MM.YYYY");
          let difference = currentDate.diff(date, "days");
          if (difference > PV.validateTill) {
            /* Fresh appointment */
            return Promise.resolve(false);
          } else {
            /* Follow up appointment */
            return Promise.resolve(true);
          }
        } else {
          /* Fresh appointment */
          return Promise.resolve(false);
        }
      } else {
        return Promise.resolve(true);
      }
    } catch (error: any) {
      return Promise.reject(error);
    }
  };
