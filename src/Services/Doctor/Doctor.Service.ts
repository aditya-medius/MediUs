import { Request } from "express";
import mongoose from "mongoose";
import appointmentPaymentModel from "../../Models/AppointmentPayment.Model";
import creditAmountModel from "../../Models/CreditAmount.Model";
import withdrawModel from "../../Models/Withdrawal.Model";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import moment from "moment";
import doctorModel from "../../Models/Doctors.Model";
import appointmentModel from "../../Models/Appointment.Model";
import { getRangeOfDates } from "../Utils";

dotenv.config();

export const getUser = async (req: Request) => {
  return req.currentDoctor ? req.currentDoctor : req.currentHospital;
};

export const getTotalEarnings = async (id: string) => {
  const totalEarnings = await creditAmountModel.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "orderId",
      },
    },
    {
      $unwind: {
        path: "$orderId",
      },
    },
    {
      $lookup: {
        from: "appointments",
        localField: "orderId.appointmentDetails",
        foreignField: "_id",
        as: "orderId.appointmentDetails",
      },
    },
    {
      $unwind: {
        path: "$orderId.appointmentDetails",
      },
    },
    {
      $match: {
        "orderId.appointmentDetails.doctors": new mongoose.Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: "$orderId.appointmentDetails.doctors",
        totalEarnings: {
          $sum: "$orderId.amount",
        },
      },
    },
  ]);

  return totalEarnings;
};

export const getAvailableAmount = async (id: string) => {
  try {
    const Promise_TotalEarning = getTotalEarnings(id);
    const Promise_PendingAmount = getPendingAmount(id);

    let [totalEarning, pendingAmount]: any = await Promise.all([
      Promise_TotalEarning,
      Promise_PendingAmount,
    ]);

    totalEarning = totalEarning[0] ? totalEarning[0].totalEarnings : null;
    pendingAmount = pendingAmount[0] ? pendingAmount[0].pendingAmount : null;

    return Promise.resolve();
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getWithdrawanAmount = async (id: string) => {
  try {
    const data = await withdrawModel.aggregate([
      {
        $match: {
          withdrawnBy: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: "$user",
          withdrawnAmount: {
            $sum: "$withdrawalAmount",
          },
        },
      },
    ]);

    return Promise.resolve(data);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getPendingAmount = async (id: string) => {
  try {
    const Promise_TotalEarning = getTotalEarnings(id);
    const Promise_WithdrawnAmount = getWithdrawanAmount(id);
    let [totalEarning, withdrawnAmount]: any = await Promise.all([
      Promise_TotalEarning,
      Promise_WithdrawnAmount,
    ]);

    totalEarning = totalEarning[0] ? totalEarning[0].totalEarnings : null;
    withdrawnAmount = withdrawnAmount[0]
      ? withdrawnAmount[0].withdrawnAmount
      : null;

    if (!totalEarning) {
      return Promise.reject("You have not earned anything");
    } else if (!withdrawnAmount) {
      return Promise.resolve(totalEarning);
    }

    return Promise.resolve(totalEarning - withdrawnAmount);
  } catch (error: any) {
    throw error;
  }
};

export const getDoctorToken = async (body: any) => {
  const token = await jwt.sign(body, process.env.SECRET_DOCTOR_KEY as string);
  return token;
};

export const getAgeOfDoctor = (dob: Date) => {
  const exp = moment(new Date(dob));
  const currentDate = moment(new Date());

  let age: any = currentDate.diff(exp, "years", true);
  if (age < 1) {
    age = currentDate.diff(exp, "months");
  }
  console.log("dsjnbdsDS:", age);
  return age;
};

export const setConsultationFeeForDoctor = async (
  doctorId: string,
  hospitalId: string,
  consultationFee: Object
) => {
  try {
    let response = await doctorModel.findOneAndUpdate(
      {
        _id: doctorId,
        "hospitalDetails.hospital": hospitalId,
      },
      {
        $set: {
          "hospitalDetails.$.consultationFee": consultationFee,
        },
      }
    );
    return Promise.resolve(true);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsOfflineAndOnlineAppointments = async (
  doctorId: string,
  body?: any
) => {
  try {
    if (!doctorId) {
      return Promise.reject("Give a doctor's Id");
    }

    let [startDate, endDate] = getRangeOfDates(body.year, body.month);

    let offlineAppointments = appointmentModel.aggregate([
      {
        $match: {
          $and: [
            {
              doctors: new mongoose.Types.ObjectId(doctorId),
            },
            {
              Type: "Offline",
            },
            {
              "time.date": { $gte: startDate, $lt: endDate },
            },
          ],
        },
      },
      {
        $count: "offline",
      },
      {
        $unwind: "$offline",
      },
    ]);

    let onlineAppointments = appointmentModel.aggregate([
      {
        $match: {
          $and: [
            {
              doctors: new mongoose.Types.ObjectId(doctorId),
            },
            {
              Type: "Online",
            },
            {
              "time.date": { $gte: startDate, $lt: endDate },
            },
          ],
        },
      },
      {
        $count: "online",
      },
      {
        $unwind: "$online",
      },
    ]);

    // let appointments = await appointmentModel.aggregate([
    //   {
    //     $facet: {
    //       offline: [
    //         {
    //           $match: {
    //             $and: [
    //               {
    //                 Type: "Offline",
    //               },
    //               {
    //                 "time.date": { $gte: startDate, $lt: endDate },
    //               },
    //             ],
    //           },
    //         },
    //         // {
    //         //   $count: "offline",
    //         // },
    //       ],
    //       online: [
    //         {
    //           $match: {
    //             $and: [
    //               {
    //                 Type: "Online",
    //               },
    //               {
    //                 "time.date": { $gte: startDate, $lt: endDate },
    //               },
    //             ],
    //           },
    //         },
    //         // {
    //         //   $count: "online",
    //         // },
    //       ],
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$offline",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$online",
    //     },
    //   },
    // ]);

    let appointments = await Promise.all([
      offlineAppointments,
      onlineAppointments,
    ]);
    return Promise.resolve(appointments.map((e: any) => e[0]));
  } catch (error: any) {
    return Promise.reject(error);
  }
};
