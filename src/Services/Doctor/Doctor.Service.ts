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
import { getDateDifferenceFromCurrentDate, getRangeOfDates } from "../Utils";
import {
  excludeHospitalFields,
  excludePatientFields,
} from "../../Controllers/Patient.Controller";
import { excludeDoctorFields } from "../../Controllers/Doctor.Controller";
import {
  address,
  appointment,
  city,
  doctor,
  hospital,
  like,
  locality,
  patient,
  prescription,
  qualification,
  qualificationNames,
  specialization,
} from "../schemaNames";
import holidayModel from "../../Models/Holiday-Calendar.Model";
import likeModel from "../../Models/Likes.Model";
import * as _ from "lodash"

import * as likeService from "../../Services/Like/Like.service";
import {
  createCityFilterForDoctor,
  createGenderFilterForDoctor,
  createNameFilterForDoctor,
  createSpecilizationFilterForDoctor,
} from "../Suvedha/Suvedha.Service";
import { getCityIdFromName, getSpecialization } from "../Admin/Admin.Service";
import workingHourModel from "../../Models/WorkingHours.Model";
import specialityModel from "../../Admin Controlled Models/Specialization.Model";
import hospitalModel from "../../Models/Hospital.Model";
import { Doctor, offDatesAndDays, UserType, Weekdays } from "../Helpers";
import overTheCounterModel from "../../Models/OverTheCounterPayment";
import advancedBookingPeriodModel from "../../Models/AdvancedBookingPeriod";
dotenv.config();

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

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
      if (unlike) {
        likeModel.findOneAndUpdate({ _id }, { $set: { unlike: false } });
      } else {
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

export const getDoctorsWithAdvancedFilters = async function (
  userId: string,
  query: any = {}
) {
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

    let doctors = await doctorModel.aggregate([
      ...aggregate,
      {
        $lookup: {
          from: like,
          localField: "_id",
          foreignField: "doctor",
          as: "like",
        },
      },
      {
        $addFields: {
          liked: {
            $filter: {
              input: "$like",
              as: "like",
              cond: {
                $eq: ["$$like.likedBy", new mongoose.Types.ObjectId(userId)],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "specializations",
          localField: "specialization",
          foreignField: "_id",
          as: "specialization",
        },
      },
      {
        $lookup: {
          from: qualification,
          localField: "qualification",
          foreignField: "_id",
          as: "qualification",
        },
      },
      {
        $lookup: {
          from: qualificationNames,
          localField: "qualification.qualificationName",
          foreignField: "_id",
          as: "qualificationName",
        },
      },
      {
        $addFields: {
          "qualification.qualificationName": "$qualificationName",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          gender: 1,
          qualification: 1,
          specialization: 1,
          image: 1,
          overallExperience: 1,
          liked: 1,
        },
      },
    ]);
    return Promise.resolve(doctors);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorById_ForSuvedha = async (doctorId: string) => {
  try {
    let doctor = await doctorModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(doctorId),
        },
      },
      {
        $lookup: {
          from: hospital,
          localField: "hospitalDetails.hospital",
          foreignField: "_id",
          as: "hospitalDetails.hospital",
        },
      },
    ]);

    return Promise.resolve(doctor);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

// Doctor inme se kis date me available hai
// export const getValidDateOfDoctorsSchedule = async (dates: Array<string>) => {
//   try {
//     let days: Array<string> = []

//     dates.forEach((e: string) => {
//       days.push(WEEKDAYS[new Date(e).getDay()])
//       days = [...new Set(days)]
//     })
//     return Promise.resolve({})
//   } catch (error: any) {
//     return Promise.reject(error)
//   }
// }

export const getDoctorWorkingDays = async (doctorId: string) => {
  try {
    let days = await workingHourModel.find(
      { doctorDetails: doctorId, "deleted.isDeleted": false },
      "-doctorDetails -hospitalDetails -byHospital -deleted"
    );
    return Promise.resolve(days);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

// Doctor ki in dates me chutti hai kya?
export const isDateHolidayForDoctor = async (
  dates: Array<string>,
  doctorId: string
) => {
  try {
    let calendar = await holidayModel.find({ doctorId, date: { $in: dates } });
    return Promise.resolve(calendar.map((e: any) => e.date));
  } catch (error: any) {
    return Promise.reject(error);
  }
};

// Doctor in dates me aur appointments le skta hai?
export const canDoctorTakeMoreAppointments = async (
  date: Array<string>,
  doctorId: string
) => {
  try {
    let appointments: any = [];

    date.forEach((e: string) => {
      let d = new Date(e);
      let gtDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      let ltDate = new Date(gtDate);
      gtDate.setDate(gtDate.getDate() + 1);
      gtDate.setUTCHours(18, 30, 0, 0);

      appointments.push(
        appointmentModel.find({
          doctors: doctorId,
          "time.date": {
            $gte: ltDate,
            $lte: gtDate,
          },
        })
      );
    });
    let data = (await Promise.all(appointments)).flat();
    return Promise.resolve(data.map((e: any) => e.time.date));
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorInfo = async (doctorId: string, date: string) => {
  try {
    const time = new Date(date);

    let d: any = time.getDay();

    let day = WEEKDAYS[d - 1];

    let common = [
      {
        $lookup: {
          from: hospital,
          localField: "hospitalDetails",
          foreignField: "_id",
          as: "hospitalDetails",
        },
      },
      {
        $unwind: "$hospitalDetails",
      },
      {
        $lookup: {
          from: address,
          localField: "hospitalDetails.address",
          foreignField: "_id",
          as: "hospitalDetails.address",
        },
      },
      {
        $lookup: {
          from: locality,
          localField: "hospitalDetails.address.locality",
          foreignField: "_id",
          as: "hospitalDetails.address.locality",
        },
      },
      {
        $lookup: {
          from: doctor,
          localField: "doctorDetails",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
      {
        $unwind: "$doctorDetails",
      },
      {
        $lookup: {
          from: "prescriptions",
          localField: "doctorDetails._id",
          foreignField: "doctorId",
          as: "temp",
        },
      },
      {
        $lookup: {
          from: "holidaycalendars",
          localField: "doctorDetails._id",
          foreignField: "doctorId",
          as: "holidayCalendar",
        },
      },
      {
        $addFields: {
          "hospitalDetails.prescription": {
            $function: {
              body: function (args: any, id: string) {
                return args.filter(
                  (e: any) => e.hospital.toString() === id.toString()
                );
              },
              args: ["$doctorDetails.hospitalDetails", "$hospitalDetails._id"],
              lang: "js",
            },
          },
          "hospitalDetails.validity": {
            $function: {
              body: function (args: any, id: string) {
                return args.filter(
                  (e: any) => e.hospitalId.toString() === id.toString()
                );
              },
              args: ["$temp", "$hospitalDetails._id"],
              lang: "js",
            },
          },
          holidayCalendar: {
            $filter: {
              input: "$holidayCalendar",
              as: "holidayCalendar",
              cond: {
                $eq: ["$$holidayCalendar.hospitalId", "$hospitalDetails._id"],
              },
            },
          },
          fee: {
            $filter: {
              input: "$doctorDetails.hospitalDetails",
              as: "fee",
              cond: {
                $eq: ["$$fee.hospital", "$hospitalDetails._id"],
              },
            },
          },
        },
      },
    ];

    let doctors = await workingHourModel.aggregate([
      {
        $facet: {
          matchedData: [
            {
              $match: {
                doctorDetails: new mongoose.Types.ObjectId(doctorId),
                [day]: { $exists: true },
              },
            },

            ...common,

            {
              $addFields: {
                "hospitalDetails.prescription": {
                  $function: {
                    body: function (args: any, id: string) {
                      return args.filter(
                        (e: any) => e.hospital.toString() === id.toString()
                      );
                    },
                    args: [
                      "$doctorDetails.hospitalDetails",
                      "$hospitalDetails._id",
                    ],
                    lang: "js",
                  },
                },
                "hospitalDetails.validity": {
                  $function: {
                    body: function (args: any, id: string) {
                      return args.filter(
                        (e: any) => e.hospitalId.toString() === id.toString()
                      );
                    },
                    args: ["$temp", "$hospitalDetails._id"],
                    lang: "js",
                  },
                },
                holidayCalendar: {
                  $filter: {
                    input: "$holidayCalendar",
                    as: "holidayCalendar",
                    cond: {
                      $eq: [
                        "$$holidayCalendar.hospitalId",
                        "$hospitalDetails._id",
                      ],
                    },
                  },
                },
              },
            },
          ],
          unmatchedData: [
            {
              $match: {
                doctorDetails: new mongoose.Types.ObjectId(doctorId),
                [day]: { $exists: false },
              },
            },
            ...common,

            {
              $addFields: {
                "hospitalDetails.prescription":
                  "$doctorDetails.hospitalDetails",
                "hospitalDetails.validity": "$temp",
                holidayCalendar: {
                  $filter: {
                    input: "$holidayCalendar",
                    as: "holidayCalendar",
                    cond: {
                      $eq: [
                        "$$holidayCalendar.hospitalId",
                        "$hospitalDetails._id",
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          data: {
            $setUnion: ["$matchedData", "$unmatchedData"],
          },
        },
      },

      { $unwind: "$data" },
      { $replaceRoot: { newRoot: "$data" } },
    ]);
    return Promise.resolve(doctors);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsHolidayByQuery = async (query: any) => {
  try {
    // const time = new Date(date);

    // let year = time.getFullYear(),
    //   month = time.getMonth(),
    //   currentDate = time.getDate();

    // let startDate = new Date(year, month, currentDate);
    // let endDate = new Date(year, month, currentDate + 1);

    // let holiday = await holidayModel.find({
    //   date: { gte: ltDate, $lte: gtDate },
    // });

    let holiday = await holidayModel.find(query);
    return Promise.resolve(holiday);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

// This function is supposed to be run ony once
export const setSpecializationActiveStatus = async () => {
  try {
    let speclizationIds = await doctorModel
      .find({}, { specialization: 1 })
      .lean();

    speclizationIds = speclizationIds
      .map((e: any) => e.specialization)
      .flat()
      .map((e: any) => e.toString());

    speclizationIds = [...new Set(speclizationIds)];

    specialityModel.updateMany(
      { _id: { $in: speclizationIds } },
      { $set: { active: true } }
    );
    return Promise.resolve(speclizationIds);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getDoctorsInHospitalByQuery = async (
  query: Object = {},
  select: Object = {}
) => {
  let doctors = await hospitalModel.find(query, select).populate("doctors");

  return doctors;
};

function getDatesMatchingDays(startDate: string, endDate: string, daysOfWeek: Array<string>) {
  let matchingDates: Array<string> = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const dayName = currentDate.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    if (_.includes(daysOfWeek, dayName)) {
      matchingDates.push(currentDate.toISOString()); // Format date as YYYY-MM-DD
    }
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return matchingDates;
}

export const getDoctorsOffDaysForADateRange = (workingDays: any, startDate: string, endDate: string): offDatesAndDays => {
  const offDays: Array<string> = getDoctorsOffDays(workingDays)
  const offDates: Array<string> = getDatesMatchingDays(startDate, endDate, offDays)
  return { offDays, offDates }
}

export const getDoctorsOffDays = (workingDays: any): Array<string> => {
  let workingDaysForADoctorInHospital: Array<string> = []
  workingDays.forEach((data: any) => {
    let workingDaysForOneRecord = Weekdays.filter((weekday: string) => {
      if (data.hasOwnProperty(weekday)) {
        return weekday
      }
    })
    workingDaysForADoctorInHospital.push(...workingDaysForOneRecord)
  })

  const offDays = _.difference(Weekdays, workingDaysForADoctorInHospital)
  return offDays
}

export const setThatDoctorTakesOverTheCounterPayments = async (doctorId: string, hospitalId: string, createdBy: UserType) => {
  try {

    const exist = await overTheCounterModel.exists({ doctorId, hospitalId })
    if (exist) {
      const error = new Error("Record already exist")
      throw error
    }

    await new overTheCounterModel({ doctorId, hospitalId, createdBy }).save()
    return Promise.resolve(true)
  } catch (error: any) {
    return Promise.reject(error)
  }
}

export const deleteThatDoctorTakesOverTheCounterPayments = async (doctorId: string, hospitalId: string) => {
  try {
    const exist = await overTheCounterModel.exists({ doctorId, hospitalId })
    if (!exist) {
      const error = new Error("Record does not exist")
      throw error
    }

    await overTheCounterModel.findOneAndDelete({ doctorId, hospitalId })
    return Promise.resolve(true)
  } catch (error: any) {
    return Promise.reject(error)
  }
}

export const checkIfDoctorTakesOverTheCounterPaymentsForAHospital = async (doctorId: string, hospitalId: string) => {
  try {
    const exist = await overTheCounterModel.exists({ doctorId, hospitalId })
    console.log("checkIfDoctorTakesOverTheCounterPaymentsForAHospital exist", exist)
    return Promise.resolve(exist)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const setDoctorsAdvancedBookingPeriod = async (doctorId: string, hospitalId: string, bookingPeriod: number) => {
  try {

    await advancedBookingPeriodModel.findOneAndUpdate(
      { doctorId, hospitalId },
      {
        $set: {
          bookingPeriod,
        },
      },
      {
        upsert: true,
        new: true
      }
    )
    return Promise.resolve(true)
  } catch (error: any) {
    return Promise.reject(error)
  }
}

export const deleteDoctorsAdvancedBookingPeriod = async (doctorId: string, hospitalId: string) => {
  try {
    const exist = await advancedBookingPeriodModel.exists({ doctorId, hospitalId })
    if (!exist) {
      const error = new Error("Record does not exist")
      throw error
    }

    await advancedBookingPeriodModel.findOneAndDelete({ doctorId, hospitalId })
    return Promise.resolve(true)
  } catch (error: any) {
    return Promise.reject(error)
  }
}

export const getDoctorsAdvancedBookingPeriod = async (doctorId: string, hospitalId: string) => {
  try {
    const bookingPeriodRecord = await advancedBookingPeriodModel.findOne({ doctorId, hospitalId }).lean()
    return Promise.resolve(bookingPeriodRecord ? bookingPeriodRecord?.bookingPeriod : 30)
  } catch (error) {
    return Promise.reject(error)
  }
}

const checkIfDoctorHasVerifiedPhoneNumberInThePastGivenDays = (doctors: Array<Doctor>, numberOfDays: number) => {
  const doctorsThatHaveNotVerifiedTheirPhoneNumber = doctors.filter((doctor: Doctor) => {
    if (!doctor?.lastTimePhoneNumberVerified) {
      return true
    }
    const dateDifference = getDateDifferenceFromCurrentDate(doctor?.lastTimePhoneNumberVerified)
    if (dateDifference < numberOfDays) {
      return true
    }
  })
  return doctorsThatHaveNotVerifiedTheirPhoneNumber
}

export const checkIfDoctorHasVerifiedPhoneNumberInThePast2Days = (doctor: Array<Doctor>) => {
  return checkIfDoctorHasVerifiedPhoneNumberInThePastGivenDays(doctor, -2)
}

export const markDoctorsPhoneNumberAsNotVerified = async (doctors: Array<Doctor>) => {
  await doctorModel.updateMany({ _id: { $in: doctors.map((doctor: Doctor) => doctor.id) } }, { $set: { phoneNumberVerified: false } })
}

export const markDoctorPhoneNumberAsVerified = async (doctor: Doctor) => {
  await doctorModel.findOneAndUpdate({ _id: doctor.id }, { $set: { phoneNumberVerified: true } })
}