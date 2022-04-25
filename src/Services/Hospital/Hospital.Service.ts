import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import hospitalModel from "../../Models/Hospital.Model";
import mongoose from "mongoose";
import { doctor, specialization } from "../schemaNames";
import approvalModel from "../../Models/Approval-Request.Model";
import appointmentModel from "../../Models/Appointment.Model";
import { getRangeOfDates } from "../Utils";
dotenv.config();

export const getHospitalToken = async (body: any) => {
  const token = await jwt.sign(body, process.env.SECRET_HOSPITAL_KEY as string);
  return token;
};

const getHospitalsDoctors_jismeRequestKiHaiOrProfileMeHai = [
  // {
  //   $match: {
  //     _id: new mongoose.Types.ObjectId(hospitalId),
  //   },
  // },
  {
    $project: {
      doctors: 1,
    },
  },
  {
    $lookup: {
      from: "approvalrequests",
      localField: "_id",
      foreignField: "requestFrom",
      as: "approval",
    },
  },
  {
    $unwind: {
      path: "$approval",
    },
  },
  {
    $project: {
      doctors: 1,
      approval: 1,
    },
  },
  {
    $project: {
      doctors: 1,
      approval: {
        $function: {
          body: function (approval: any) {
            let data = [approval.requestTo];
            return data;
          },
          lang: "js",
          args: ["$approval"],
        },
      },
    },
  },
  {
    $project: {
      doctors: {
        $setUnion: ["$doctors", "$approval"],
      },
    },
  },
  {
    $lookup: {
      from: "doctors",
      localField: "doctors",
      foreignField: "_id",
      as: "doctors",
    },
  },
  {
    $unwind: {
      path: "$doctors",
    },
  },
];

export const getHospitalsSpecilization_AccordingToDoctor = async (
  hospitalId: string
) => {
  try {
    let specializaitons = await hospitalModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(hospitalId),
        },
      },
      ...getHospitalsDoctors_jismeRequestKiHaiOrProfileMeHai,
      {
        $project: {
          "doctors.specialization": 1,
        },
      },
      {
        $lookup: {
          from: "specializations",
          localField: "doctors.specialization",
          foreignField: "_id",
          as: "specialization",
        },
      },
      {
        $unwind: {
          path: "$specialization",
        },
      },
      {
        $project: {
          specialization: 1,
        },
      },
    ]);

    return Promise.resolve(specializaitons);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsListInHospital_withApprovalStatus = async (
  hospitalId: string
) => {
  try {
    let doctors = await hospitalModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(hospitalId),
        },
      },
      {
        $facet: {
          approved: [
            {
              $lookup: {
                from: "approvalrequests",
                localField: "_id",
                foreignField: "requestFrom",
                as: "approved",
              },
            },
            {
              $project: {
                "approved.requestTo": 1,
                "approved.approvalStatus": 1,
              },
            },
            {
              $unwind: "$approved",
            },
            {
              $lookup: {
                from: "doctors",
                localField: "approved.requestTo",
                foreignField: "_id",
                as: "approved.doctor",
              },
            },
            {
              $unwind: "$approved.doctor",
            },
            {
              $addFields: {
                doctor: "$approved.doctor",
              },
            },
            {
              $addFields: {
                status: "$approved.approvalStatus",
              },
            },
            {
              $project: {
                approved: 0,
              },
            },
          ],
          doctors: [
            {
              $lookup: {
                from: "doctors",
                localField: "doctors",
                foreignField: "_id",
                as: "doctors",
              },
            },
            {
              $addFields: {
                doctor: "$doctors",
              },
            },
            {
              $project: {
                doctor: 1,
              },
            },
            {
              $unwind: "$doctor",
            },
          ],
        },
      },
      {
        $project: {
          doctors: {
            $setUnion: ["$approved", "$doctors"],
          },
        },
      },
    ]);
    return Promise.resolve(doctors);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getHospitalsOfflineAndOnlineAppointments = async (
  hospitalId: string,
  body?: any
) => {
  try {
    if (!hospitalId) {
      return Promise.reject("Give a Hospital's Id");
    }
    let [startDate, endDate] = getRangeOfDates(body.year, body.month);

    let offlineAppointments = appointmentModel.aggregate([
      {
        $match: {
          $and: [
            {
              hospital: new mongoose.Types.ObjectId(hospitalId),
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
              hospital: new mongoose.Types.ObjectId(hospitalId),
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

    let appointments = await Promise.all([
      offlineAppointments,
      onlineAppointments,
    ]);
    return Promise.resolve(appointments.map((e: any) => e[0]));
  } catch (error: any) {
    return Promise.reject(error);
  }
};
