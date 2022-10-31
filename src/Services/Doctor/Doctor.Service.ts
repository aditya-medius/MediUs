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
import {
  excludeHospitalFields,
  excludePatientFields,
} from "../../Controllers/Patient.Controller";
import { excludeDoctorFields } from "../../Controllers/Doctor.Controller";
import { doctor, hospital, patient, specialization } from "../schemaNames";
import holidayModel from "../../Models/Holiday-Calendar.Model";
import likeModel from "../../Models/Likes.Model";

import * as likeService from "../../Services/Like/Like.service";
import {
  createCityFilterForDoctor,
  createGenderFilterForDoctor,
  createNameFilterForDoctor,
  createSpecilizationFilterForDoctor,
} from "../Suvedha/Suvedha.Service";
import { getCityIdFromName, getSpecialization } from "../Admin/Admin.Service";
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

export const getListOfAllAppointments = async (
  doctorId: string,
  page: string
) => {
  try {
    const limit: number = 10;
    const skip: number = parseInt(page) * limit;
    let appointmentsInThisHospital = await appointmentModel.aggregate([
      {
        $match: {
          doctors: new mongoose.Types.ObjectId(doctorId),
        },
      },
      {
        $lookup: {
          from: patient,
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $unwind: "$hospital",
      },
      {
        $lookup: {
          from: hospital,
          localField: "hospital",
          foreignField: "_id",
          as: "hospital",
        },
      },
      {
        $lookup: {
          from: doctor,
          localField: "doctors",
          foreignField: "_id",
          as: "doctors",
        },
      },
      {
        $lookup: {
          from: specialization,
          localField: "doctors.specialization",
          foreignField: "_id",
          as: "specials",
        },
      },
      // {
      //   $unwind: "doctors.specialization",
      // },
      {
        $unwind: "$doctors",
      },
      {
        $unwind: "$hospital",
      },
      {
        $project: {
          "patient.firstName": 1,
          "patient.lastName": 1,
          "patient.DOB": 1,
          "patient.gender": 1,
          "patient.phoneNumber": 1,
          "hospital.name": 1,
          "hospital.address": 1,
          "doctors.firstName": 1,
          "doctors.lastName": 1,
          // "doctors.specialization": 1,
          specials: 1,
          createdAt: 1,
          appointmentToken: 1,
          appointmentId: 1,
          appointmentType: 1,
          Type: 1,
          done: 1,
          cancelled: 1,
          rescheduled: 1,
          time: 1,
        },
      },
      {
        $addFields: {
          "patient.age": {
            $function: {
              body: function (dob: any) {
                dob = new Date(dob);
                let currentDate = new Date();
                let age: number | string =
                  currentDate.getFullYear() - dob.getFullYear();
                if (age > 0) {
                  age = `${age} years`;
                } else {
                  age = `${age} months`;
                }
                return age;
              },
              lang: "js",
              args: ["$patient.DOB"],
            },
          },
          "doctors.specialization": "$specials",
        },
      },
      {
        $sort: {
          "time.date": -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    return Promise.resolve(appointmentsInThisHospital);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getAppointmentFeeFromAppointmentId = async (
  appointmentId: string
) => {
  try {
    let appointment = await appointmentPaymentModel
      .findOne({
        appointmentId: appointmentId,
      })
      .populate("orderId")
      .lean();
    return Promise.resolve(appointment);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorFeeInHospital = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let fee = (
      await doctorModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(doctorId),
          },
        },
        {
          $project: {
            hospitalDetails: 1,
          },
        },
      ])
    )[0];
    fee = fee.hospitalDetails
      .filter((e: any) => {
        return e.hospital.toString() === hospitalId;
      })
      .map((e: any) => e.consultationFee);
    return Promise.resolve({ consultationFee: fee[0] });
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const checkIfDoctorIsAvailableOnTheDay = async (
  date: number,
  month: number,
  year: number,
  doctorId: string,
  hospitalId: string
) => {
  try {
    month = month - 1;
    let startDate = new Date(year, month, date);
    let endDate = new Date(year, month, date + 1);

    let holidayExist = await holidayModel.findOne({
      doctorId,
      hospitalId,
      date: { $gte: startDate, $lte: endDate },
      "delData.deleted": false,
    });
    return Promise.resolve(holidayExist);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const likeDoctor = async (
  likedDoctorId: string,
  likedById: string,
  reference = patient
) => {
  try {
    let likeExist = await likeService.likeExist(likedDoctorId, likedById);
    if (!likeExist) {
      let liked = await new likeModel({
        doctor: likedDoctorId,
        likedBy: likedById,
        reference,
      }).save();

      return Promise.resolve(true);
    } else {
      let { unlike, _id } = await likeService.getLikeById(
        likedDoctorId,
        likedById
      );
      console.log("unliked", unlike && unlike);
      if (unlike) {
        likeModel.findOneAndUpdate({ _id }, { $set: { unlike: false } });
      } else {
        console.log("dsdsjbdsnbdsjsdds", { _id });
        likeModel.findOneAndUpdate({ _id }, { $set: { unlike: true } });
      }
      return Promise.resolve(!unlike);

      // return Promise.resolve(true);
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const unlikeDoctor = async (
  likedDoctorId: string,
  likedById: string,
  reference = patient
) => {
  try {
    let likeExist = await likeService.likeExist(likedDoctorId, likedById);
    if (!likeExist) {
      return Promise.reject("You have not liked this doctor");
    } else {
      let unlike = await likeModel.findOneAndUpdate(
        {
          doctor: likedDoctorId,
          likedBy: likedById,
          reference,
        },
        {
          $set: {
            unlike: true,
          },
        }
      );
      return Promise.resolve(unlike ? false : true);
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getMyLikes = async (doctorId: string) => {
  try {
    let likes = await likeModel
      .find({
        doctor: doctorId,
        $or: [{ unlike: { $exists: false } }, { unlike: false }],
      })
      .populate({ path: "doctor", select: excludeDoctorFields })
      .populate({ path: "likedBy", select: "-password" });
    return Promise.resolve(likes);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsWithAdvancedFilters = async (query: any = {}) => {
  try {
    let { gender, experience, city, name, specialization } = query;
    let aggregate = [
      {
        $match: {},
      },
    ];
    if (city) {
      city = await getCityIdFromName(city);
    }
    if (specialization) {
      specialization = await getSpecialization(specialization);
    }

    city && aggregate.push(...createCityFilterForDoctor(city._id));
    gender && aggregate.push(...createGenderFilterForDoctor(gender));
    name && aggregate.push(...createNameFilterForDoctor(name));
    specialization &&
      aggregate.push(...createSpecilizationFilterForDoctor(specialization._id));

    let doctors = await doctorModel.aggregate(aggregate);
    return Promise.resolve(doctors);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
