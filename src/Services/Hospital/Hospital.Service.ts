import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import hospitalModel from "../../Models/Hospital.Model";
import mongoose from "mongoose";
import {
  appointmentPayment,
  doctor,
  holidayCalendar,
  hospital,
  order,
  patient,
  qualification,
  qualificationNames,
  specialization,
} from "../schemaNames";
import approvalModel from "../../Models/Approval-Request.Model";
import appointmentModel from "../../Models/Appointment.Model";
import { getAge, getDateDifference, getDateDifferenceFromCurrentDate, getRangeOfDates } from "../Utils";
import patientModel from "../../Models/Patient.Model";
import { phoneNumberValidation } from "../Validation.Service";
import moment from "moment";
import { BookAppointment } from "../Helpers/Patient.Service";
import creditAmountModel from "../../Models/CreditAmount.Model";
import appointmentPaymentModel from "../../Models/AppointmentPayment.Model";
import * as orderController from "../../Controllers/Order.Controller";
import holidayModel from "../../Models/Holiday-Calendar.Model";
import workingHourModel from "../../Models/WorkingHours.Model";
import { getPreEmitDiagnostics } from "typescript";
import prescriptionModel from "../../Models/Prescription.Model";
import doctorModel from "../../Models/Doctors.Model";
import { AppointmentStatus, Holiday } from "../Helpers";
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
      {
        $project: {
          "specialization._id": 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          specializations: {
            $addToSet: "$specialization._id",
          },
        },
      },
      {
        $lookup: {
          from: "specializations",
          localField: "specializations",
          foreignField: "_id",
          as: "specializations",
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
                from: qualificationNames,
                localField: "doctor.qualification.qualificationName",
                foreignField: "_id",
                as: "doctor.qualification.qualificationName",
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
          requestTo: [
            {
              $lookup: {
                from: "approvalrequests",
                localField: "_id",
                foreignField: "requestTo",
                as: "approved",
              },
            },
            {
              $project: {
                "approved.requestFrom": 1,
                "approved.approvalStatus": 1,
              },
            },
            {
              $unwind: "$approved",
            },
            {
              $lookup: {
                from: "doctors",
                localField: "approved.requestFrom",
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
                from: qualificationNames,
                localField: "doctor.qualification.qualificationName",
                foreignField: "_id",
                as: "doctor.qualification.qualificationName",
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
          // doctors: [
          //   {
          //     $lookup: {
          //       from: "doctors",
          //       localField: "doctors",
          //       foreignField: "_id",
          //       as: "doctors",
          //     },
          //   },
          //   {
          //     $addFields: {
          //       doctor: "$doctors",
          //     },
          //   },
          //   {
          //     $project: {
          //       doctor: 1,
          //     },
          //   },
          //   {
          //     $unwind: "$doctor",
          //   },
          //   {
          //     $lookup: {
          //       from: qualification,
          //       localField: "doctor.qualification",
          //       foreignField: "_id",
          //       as: "doctor.qualification",
          //     },
          //   },
          //   {
          //     $lookup: {
          //       from: specialization,
          //       localField: "doctor.specialization",
          //       foreignField: "_id",
          //       as: "doctor.specialization",
          //     },
          //   },
          //   {
          //     $addFields: {
          //       status: "$approved.approvalStatus",
          //       experience: {
          //         $function: {
          //           body: function (experience: any) {
          //             experience = new Date(experience);
          //             let currentDate = new Date();
          //             let age: number | string =
          //               currentDate.getFullYear() - experience.getFullYear();
          //             if (age > 0) {
          //               age = `${age} years`;
          //             } else {
          //               age = `${age} months`;
          //             }
          //             return age;
          //           },
          //           lang: "js",
          //           args: ["$doctor.overallExperience"],
          //         },
          //       },
          //     },
          //   },
          // ],
        },
      },
      {
        $project: {
          doctors: {
            $setUnion: ["$approved", "$requestTo"],
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
          "doctors._id": 1,
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
        $lookup: {
          from: appointmentPayment,
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$appointmentId", "$$id"] },
              },
            },
            {
              $lookup: {
                from: order,
                localField: "orderId",
                foreignField: "_id",
                as: "order",
              },
            },
            {
              $unwind: "$order",
            },
            {
              $project: {
                order: 1,
              },
            },
          ],
          as: "paymentInfo",
          // localField: "_id",
          // foreignField: "appointmentId",
          // as: "paymentInfo",
        },
      },
      {
        $unwind: "$paymentInfo",
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

export const verifyPayment = async (body: any, isHospital: boolean = false) => {
  try {
    // payment Id aur payment signature
    let paymentId = `payment_id_gen_${Math.floor(
      100000 + Math.random() * 900000
    ).toString()}`;

    let paymentSignature = `payment_sign_gen_${Math.floor(
      100000 + Math.random() * 900000
    ).toString()}`;

    const appointmentBook = await BookAppointment(body.appointment, isHospital);
    const { orderId, orderReceipt } = body;
    const paymentObj = await new appointmentPaymentModel({
      paymentId,
      orderId: body.appointmentOrderId,
      paymentSignature,
      orderReceipt,
      appointmentId: appointmentBook._id,
    }).save();

    await new creditAmountModel({
      orderId: body.appointmentOrderId,
      appointmentDetails: appointmentBook._id,
    }).save();
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const generateOrderId = async (body: any) => {
  try {
    const { appointmentOrderId, options, receiptNumber } =
      await orderController.generateOrderId(body);

    let orderId = `order_${Math.floor(
      100000 + Math.random() * 900000
    ).toString()}`;

    return Promise.resolve({
      appointmentOrderId,
      orderId: orderId,
      orderReceipt: `order_rcptid_${receiptNumber}`,
    });
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const doesHospitalExist = async (id: string) => {
  try {
    let hospitalExist = await hospitalModel.exists({ _id: id });
    return Promise.resolve(hospitalExist);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getHolidayTimigsOfDoctorsInHospital = async (
  hospitalId: string,
  doctorId: Array<string>,
  timings: string
) => {
  try {
    const time = new Date(timings);

    let year = time.getFullYear(),
      month = time.getMonth(),
      currentDate = time.getDate();

    let startDate = new Date(year, month, currentDate);
    let endDate = new Date(year, month, currentDate + 1);

    let holidays: any = await holidayModel
      .find({
        hospitalId,
        doctorId: { $in: doctorId },
        date: { $gte: startDate, $lte: endDate },
        "delData.deleted": false,
      })
      .lean();

    return holidays;
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsWorkingHourInHospital = async (
  hospitalId: string,
  doctorId: Array<string>,
  day: string
) => {
  try {
    let workingHours = await workingHourModel.find({
      hospitalDetails: hospitalId,
      doctorDetails: { $in: doctorId },
      [day]: { $exists: true },
    });

    return Promise.resolve(workingHours);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsPrescriptionValidityInHospital = async (
  hospitalId: string,
  doctorId: Array<String>
) => {
  try {
    let prescription = await prescriptionModel
      .find({
        hospitalId: hospitalId,
        doctorId: { $in: doctorId },
      })
      .lean();

    return Promise.resolve(prescription);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const doctorsInHospital = async (
  hospitalId: string,
  timings: string
) => {
  try {
    let day: any = new Date(timings).getDay();

    let WEEK_DAYS = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    day = WEEK_DAYS[day];

    let hospital: any = await hospitalModel
      .findOne({
        _id: hospitalId,
      })
      .populate({
        path: "doctors",
        populate: {
          path: "qualification specialization",
        },
      })
      .populate({
        path: "address",
        populate: {
          path: "city locality",
        },
      })
      .lean();

    let doctors = hospital.doctors.map((e: any) => e._id.toString());

    // Get holiday timings of doctors in hospital
    let holiday: any = await getHolidayTimigsOfDoctorsInHospital(
      hospital,
      doctors,
      timings
    );

    // Doctors working hours in hospital
    let workingHours: any = await getDoctorsWorkingHourInHospital(
      hospitalId,
      doctors,
      day
    );

    // Doctor's prescription for hospital
    let prescriptions: any = await getDoctorsPrescriptionValidityInHospital(
      hospitalId,
      doctors
    );

    let newData = hospital.doctors.map((e: any) => {
      let exist = holiday.find(
        (elem: any) => elem.doctorId.toString() === e._id.toString(0)
      );

      let WH = workingHours.filter(
        (elem: any) => elem.doctorDetails.toString() === e._id.toString()
      );

      let PRES = prescriptions.find(
        (elem: any) => elem.doctorId.toString() === e._id.toString()
      );

      let obj = {
        ...e,
        workingHours: WH,
        prescription: PRES,
        available: true,
        scheduleAvailable: true,
      };

      if (exist) {
        obj = {
          ...e,
          available: false,
          workingHours: WH,
          prescription: PRES,
          scheduleAvailable: true,
        };
      }
      if (!WH.length) {
        obj = {
          ...obj,
          available: false,
          scheduleAvailable: false,
          prescription: PRES,
        };
      }

      return obj;
    });

    hospital.doctors = newData;

    return Promise.resolve(hospital);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getHolidayTimigsOfHospitalsInDoctor = async (
  doctorId: string,
  hospitalId: Array<string>,
  timings: string
) => {
  try {
    const time = new Date(timings);
    let year = time.getFullYear(),
      month = time.getMonth(),
      currentDate = time.getDate();

    let startDate = new Date(year, month, currentDate);
    let endDate = new Date(year, month, currentDate + 1);

    let holidays: any = await holidayModel
      .find({
        doctorId,
        hospitalId: { $in: hospitalId },
        date: { $gte: startDate, $lte: endDate },
        "delData.deleted": false,
      })
      .lean();

    console.log("ljhgfcghvdssds", holidays);

    return holidays;
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getHospitalsWorkingHourInDoctor = async (
  doctorId: string,
  hospitalId: Array<string>,
  day: string
) => {
  try {
    let workingHours = await workingHourModel
      .find({
        hospitalDetails: { $in: hospitalId },
        doctorDetails: doctorId,
        [day]: { $exists: true },
      })
      .lean();

    return Promise.resolve(workingHours);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getHospitalsPrescriptionValidityInDoctor = async (
  doctorId: string,
  hospitalId: Array<string>
) => {
  try {
    console.log("doctorsd", doctorId);
    console.log("hsiusihjbsss", hospitalId);
    let prescription = await prescriptionModel
      .find({
        hospitalId: { $in: hospitalId },
        doctorId: doctorId,
      })
      .lean();

    return Promise.resolve(prescription);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const hospitalsInDoctor = async (doctorId: string, timings: string) => {
  try {
    let day: any = new Date(timings).getDay();

    let WEEK_DAYS = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    day = WEEK_DAYS[day];

    let doctors: any = await doctorModel
      .findOne({ _id: doctorId })
      .populate({
        path: "specialization qualification",
      })
      .populate({
        path: "hospitalDetails.hospital",
        populate: {
          path: "address",
          populate: {
            path: "city locality",
          },
        },
      })
      .lean();
    // .populate({
    //   path: "hospitalDetails.hospital.address",
    //   // populate: {
    //   //   path: "hospitalDetails.hospital.address.city hospitalDetails.hospital.address.locality",
    //   // },
    // });

    let hospitals: Array<string> = doctors.hospitalDetails.map((e: any) =>
      e?.hospital?._id?.toString()
    );

    // Get holiday timings of doctors in hospital
    let holiday: any = await getHolidayTimigsOfHospitalsInDoctor(
      doctors._id,
      hospitals,
      timings
    );

    // // Doctors working hours in hospital
    let workingHours: any = await getHospitalsWorkingHourInDoctor(
      doctors._id,
      hospitals,
      day
    );

    // // Doctor's prescription for hospital
    let prescriptions: any = await getHospitalsPrescriptionValidityInDoctor(
      doctors._id,
      hospitals
    );

    let newData = doctors.hospitalDetails.map((e: any) => {
      let exist = holiday.find(
        (elem: any) =>
          elem.hospitalId.toString() === e?.hospital?._id.toString(0)
      );

      let WH = workingHours.filter(
        (elem: any) =>
          elem.hospitalDetails.toString() === e?.hospital?._id.toString()
      );

      let PRES = prescriptions.find(
        (elem: any) =>
          elem.hospitalId.toString() === e?.hospital?._id.toString()
      );

      let obj = {
        ...e,
        workingHours: WH,
        prescription: PRES,
        available: true,
        scheduleAvailable: true,
      };

      if (exist) {
        obj = {
          ...e,
          available: false,
          workingHours: WH,
          prescription: PRES,
          scheduleAvailable: true,
        };
      }
      if (!WH) {
        obj = {
          ...obj,
          available: false,
          scheduleAvailable: false,
          prescription: PRES,
        };
      }

      return obj;
    });
    doctors.hospitalDetails = newData;
    return Promise.resolve(doctors);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getHospitalById = async (hospitalId: string) => {
  try {
    let hospitalData = await hospitalModel
      .find({ _id: hospitalId })
      .populate({
        path: "address",
        populate: {
          path: "city state locality",
        },
      })
      .populate({
        path: "anemity services",
      });
    return Promise.resolve(hospitalData);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getCitiesWhereHospitalsExist = async () => {
  try {
    let data = await hospitalModel
      .find({})
      .populate({
        path: "address",
        select: "city",
        populate: {
          path: "city",
        },
      })
      .select("address")
      .lean();

    let cities: Array<any> = [];

    data.map((e: any) => {
      let city = e?.address;
      let exist = cities.find((elem: any) => elem?._id === city?.city?._id);
      if (!exist) {
        cities.push({
          _id: city?.city?._id,
          name: city?.city?.name,
        });
      }
    });

    return cities;
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const changeAppointmentStatus = async (id: string, status: AppointmentStatus) => {
  try {
    if (!Object.values(AppointmentStatus).includes(status)) {
      const error = new Error("Invalid status value")
      return Promise.reject(error)
    }
    await appointmentModel.findOneAndUpdate({ _id: id, }, { $set: { appointmentStatus: status } })
    return true;
  } catch (error: any) {
    return Promise.reject(error)
  }
}

export const addHolidayForHospital = async (id: string, date: Array<Date>) => {
  try {
    const updatedRecord = await hospitalModel.findOneAndUpdate({ _id: id }, { $push: { holiday: date } }, { upsert: true, new: true })
    return updatedRecord;
  } catch (error: any) {
    return Promise.reject(error)
  }
}

export const getHolidayForHospital = async (id: string) => {
  try {
    const record = await hospitalModel.findOne({ _id: id }, "holiday").lean()
    const holidays: Array<Date> = record?.holiday
    const isCloseTomorrow = holidays.some((date: Date) => getDateDifferenceFromCurrentDate(date) === 1)
    return { ...record, isCloseTomorrow };
  } catch (error: any) {
    return Promise.reject(error)
  }
}

export const updateHospitalsLastLogin = async (hospitalId: string) => {
  const hospital = await hospitalModel.findOne({ _id: hospitalId })
  if (hospital) {
    hospital.lastLogin = new Date()
    hospital.save()
  }
}