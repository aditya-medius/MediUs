import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import hospitalModel from "../../Models/Hospital.Model";
import mongoose from "mongoose";
import {
  doctor,
  hospital,
  patient,
  qualification,
  specialization,
} from "../schemaNames";
import approvalModel from "../../Models/Approval-Request.Model";
import appointmentModel from "../../Models/Appointment.Model";
import { getAge, getRangeOfDates } from "../Utils";
import patientModel from "../../Models/Patient.Model";
import { phoneNumberValidation } from "../Validation.Service";
import moment from "moment";
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
              $lookup: {
                from: qualification,
                localField: "doctor.qualification",
                foreignField: "_id",
                as: "doctor.qualification",
              },
            },
            {
              $lookup: {
                from: specialization,
                localField: "doctor.specialization",
                foreignField: "_id",
                as: "doctor.specialization",
              },
            },
            {
              $addFields: {
                status: "$approved.approvalStatus",
                experience: {
                  $function: {
                    body: function (experience: any) {
                      experience = new Date(experience);
                      let currentDate = new Date();
                      let age: number | string =
                        currentDate.getFullYear() - experience.getFullYear();
                      if (age > 0) {
                        age = `${age} years`;
                      } else {
                        age = `${age} months`;
                      }
                      return age;
                    },
                    lang: "js",
                    args: ["$doctor.overallExperience"],
                  },
                },
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
            {
              $lookup: {
                from: qualification,
                localField: "doctor.qualification",
                foreignField: "_id",
                as: "doctor.qualification",
              },
            },
            {
              $lookup: {
                from: specialization,
                localField: "doctor.specialization",
                foreignField: "_id",
                as: "doctor.specialization",
              },
            },
            {
              $addFields: {
                status: "$approved.approvalStatus",
                experience: {
                  $function: {
                    body: function (experience: any) {
                      experience = new Date(experience);
                      let currentDate = new Date();
                      let age: number | string =
                        currentDate.getFullYear() - experience.getFullYear();
                      if (age > 0) {
                        age = `${age} years`;
                      } else {
                        age = `${age} months`;
                      }
                      return age;
                    },
                    lang: "js",
                    args: ["$doctor.overallExperience"],
                  },
                },
              },
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

export const getPatientFromPhoneNumber = async (phoneNumber: string) => {
  try {
    if (phoneNumberValidation(phoneNumber)) {
      let patientId = await patientModel.findOne({ phoneNumber }, "_id");
      if (patientId) {
        return Promise.resolve(patientId);
      } else {
        return Promise.reject(
          new Error("No patient exist with this phone number")
        );
      }
    } else {
      return Promise.reject(new Error("Invalid phone number"));
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};
export const getPatientsAppointmentsInThisHospital = async (
  hospitalId: string,
  phoneNumber_patient: string,
  page: string
) => {
  try {
    let formatAge = getAge;
    const limit: number = 10;
    const skip: number = parseInt(page) * limit;
    let patientId = await getPatientFromPhoneNumber(phoneNumber_patient);
    let appointmentsInThisHospital = await appointmentModel.aggregate([
      {
        $match: {
          patient: new mongoose.Types.ObjectId(patientId),
          hospital: new mongoose.Types.ObjectId(hospitalId),
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
