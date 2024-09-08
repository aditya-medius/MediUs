import workingHourModel from "../../Models/WorkingHours.Model";
import appointmentModel from "../../Models/Appointment.Model";
import moment from "moment";
import {
  generateAppointmentId,
  getTokenNumber,
} from "../Appointment/Appointment.Service";
import addressModel from "../../Models/Address.Model";
import hospitalModel from "../../Models/Hospital.Model";
import advancedBookingPeriodModel from "../../Models/AdvancedBookingPeriod";
import { Patient } from "./patient.values";
import { patient } from "../schemaNames";
import { PairValue } from "underscore";
import patientModel from "../../Models/Patient.Model";
import { digiMilesSMS } from "../Utils";
import doctorModel from "../../Models/Doctors.Model";

export const BookAppointment = async (body: any, isHospital = false) => {
  try {
    const rd: Date = new Date(body.time.date);
    const d = rd.getDay();
    let b = body;
    let query: any = {};
    if (d == 0) {
      query["sunday.working"] = true;
      query["sunday.from.time"] = b.time.from.time;
      query["sunday.from.division"] = b.time.from.division;
      query["sunday.till.time"] = b.time.till.time;
      query["sunday.till.division"] = b.time.till.division;
    } else if (d == 1) {
      query["monday.working"] = true;
      query["monday.from.time"] = b.time.from.time;
      query["monday.from.division"] = b.time.from.division;
      query["monday.till.time"] = b.time.till.time;
      query["monday.till.division"] = b.time.till.division;
    } else if (d == 2) {
      query["tuesday.working"] = true;
      query["tuesday.from.time"] = b.time.from.time;
      query["tuesday.from.division"] = b.time.from.division;
      query["tuesday.till.time"] = b.time.till.time;
      query["tuesday.till.division"] = b.time.till.division;
    } else if (d == 3) {
      query["wednesday.working"] = true;
      query["wednesday.from.time"] = b.time.from.time;
      query["wednesday.from.division"] = b.time.from.division;
      query["wednesday.till.time"] = b.time.till.time;
      query["wednesday.till.division"] = b.time.till.division;
    } else if (d == 4) {
      query["thursday.working"] = true;
      query["thursday.from.time"] = b.time.from.time;
      query["thursday.from.division"] = b.time.from.division;
      query["thursday.till.time"] = b.time.till.time;
      query["thursday.till.division"] = b.time.till.division;
    } else if (d == 5) {
      query["friday.working"] = true;
      query["friday.from.time"] = b.time.from.time;
      query["friday.from.division"] = b.time.from.division;
      query["friday.till.time"] = b.time.till.time;
      query["friday.till.division"] = b.time.till.division;
    } else if (d == 6) {
      query["saturday.working"] = true;
      query["saturday.from.time"] = b.time.from.time;
      query["saturday.from.division"] = b.time.from.division;
      query["saturday.till.time"] = b.time.till.time;
      query["saturday.till.division"] = b.time.till.division;
    }

    let WEEK_DAYS = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    body.time.date = new Date(body.time.date);
    // body.time.date = new Date(body.time.date);
    const requestDate: Date = new Date(body.time.date);

    const day = requestDate.getDay();

    // @TODO check if working hour exist first
    let capacity = await workingHourModel.findOne({
      doctorDetails: body.doctors,
      hospitalDetails: body.hospital,
      [WEEK_DAYS[day]]: { $exists: true },
    });
    if (!capacity) {
      let error: Error = new Error("Error");
      error.message = "Cannot create appointment";
      // return errorResponse(error, res);
      throw error;
    }

    if (day == 0) {
      capacity = capacity.sunday;
    } else if (day == 1) {
      capacity = capacity.monday;
    } else if (day == 2) {
      capacity = capacity.tuesday;
    } else if (day == 3) {
      capacity = capacity.wednesday;
    } else if (day == 4) {
      capacity = capacity.thursday;
    } else if (day == 5) {
      capacity = capacity.friday;
    } else if (day == 6) {
      capacity = capacity.saturday;
    }
    if (!capacity) {
      const error: Error = new Error("Doctor not available on this day");
      error.name = "Not available";
      //   return errorResponse(error, res);
      return Promise.reject(error);
    }
    let appointmentCount = await appointmentModel.find({
      doctors: body.doctors,
      hospital: body.hospital,
      "time.from.time": capacity.from.time,
      "time.till.time": capacity.till.time,
    });

    let appCount = 0;
    appointmentCount = appointmentCount.map((e: any) => {
      if (
        new Date(e.time.date).getDate() == new Date(requestDate).getDate() &&
        new Date(e.time.date).getFullYear() ==
        new Date(requestDate).getFullYear() &&
        new Date(e.time.date).getMonth() == new Date(requestDate).getMonth()
      ) {
        appCount++;
      }
    });

    let message = "Successfully booked appointment";

    if (!(appCount < capacity.capacity)) {
      //   return errorResponse(
      //     new Error("Doctor cannot take any more appointments"),
      //     res
      //   );
      if (isHospital) {
        message = `Doctor's appointment have exceeded doctor's capacity for the day by ${appCount - capacity.capacity + 1
          }`;
      } else {
        return Promise.reject(
          new Error("Doctor cannot take any more appointments")
        );
      }
    }
    let appointmentTokenNumber = (await getTokenNumber(body)) + 1;
    let appointmentId = generateAppointmentId();

    body["appointmentToken"] = appointmentTokenNumber;
    body["appointmentId"] = appointmentId;
    let appointmentBook = await new appointmentModel({ ...body, createdAt: new Date() }).save();
    await appointmentBook.populate({
      path: "subPatient",
      select: {
        parentPatient: 0,
      },
    });

    const doctorData = doctorModel.findOne({ _id: appointmentBook.doctors });
    const hospitalData = hospitalModel.findOne({ _id: appointmentBook.hospital });
    const patientData = patientModel.findOne({ _id: appointmentBook.patient });

    let arr = [doctorData, hospitalData, patientData];
    Promise.all(arr).then((result: any) => {
      const [doctor, hospital, patient] = result
      digiMilesSMS.sendAppointmentConfirmationNotification(
        patient.phoneNumber,
        `${patient.firstName} ${patient.lastName}`,
        `${doctor.firstName} ${doctor.lastname}`,
        hospital.hospitalName,
        moment(appointmentBook.time.date).format("DD-MM-YYYY"),
        `${appointmentBook.time.from.time}:${appointmentBook.time.from.division} -${appointmentBook.time.till.time}:${appointmentBook.time.till.division}`
      )
    })
    return Promise.resolve(appointmentBook);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const calculateAge = (DOB: Date) => {
  const exp = moment(DOB);
  const currentDate = moment(new Date());

  let age: any = currentDate.diff(exp, "years", true);

  age = parseInt(age).toFixed(2);

  if (age < 1) {
    age = `${currentDate.diff(exp, "months")} months`;
  } else {
    age = `${age} years`;
  }
  return age;
};

export const canDoctorTakeAppointment = async (body: any) => {
  const time = new Date(body.time.date);

  const bookingPeriod = await advancedBookingPeriodModel.findOne({ doctorId: body.doctors, hospitalId: body.hospital }, "bookingPeriod")
  const advancedBookingPeriod = bookingPeriod?.bookingPeriod;
  
  if (bookingPeriod && !isAdvancedBookingValid(moment(time), advancedBookingPeriod)) {
    const error: Error = new Error("Cannot book appointment for this day");
    error.name = "Not available";
    throw error
  }


  let d: any = time.getDay();
  let query: any = {
    doctorDetails: body.doctors,
    hospitalDetails: body.hospital,
  };

  if (d == 0) {
    d = "sunday";
    query["sunday.working"] = true;
    query["sunday.from.time"] = body.time.from.time;
    query["sunday.from.division"] = body.time.from.division;
    query["sunday.till.time"] = body.time.till.time;
    query["sunday.till.division"] = body.time.till.division;
  } else if (d == 1) {
    query["monday.working"] = true;
    query["monday.from.time"] = body.time.from.time;
    query["monday.from.division"] = body.time.from.division;
    query["monday.till.time"] = body.time.till.time;
    query["monday.till.division"] = body.time.till.division;
  } else if (d == 2) {
    query["tuesday.working"] = true;
    query["tuesday.from.time"] = body.time.from.time;
    query["tuesday.from.division"] = body.time.from.division;
    query["tuesday.till.time"] = body.time.till.time;
    query["tuesday.till.division"] = body.time.till.division;
  } else if (d == 3) {
    query["wednesday.working"] = true;
    query["wednesday.from.time"] = body.time.from.time;
    query["wednesday.from.division"] = body.time.from.division;
    query["wednesday.till.time"] = body.time.till.time;
    query["wednesday.till.division"] = body.time.till.division;
  } else if (d == 4) {
    query["thursday.working"] = true;
    query["thursday.from.time"] = body.time.from.time;
    query["thursday.from.division"] = body.time.from.division;
    query["thursday.till.time"] = body.time.till.time;
    query["thursday.till.division"] = body.time.till.division;
  } else if (d == 5) {
    query["friday.working"] = true;
    query["friday.from.time"] = body.time.from.time;
    query["friday.from.division"] = body.time.from.division;
    query["friday.till.time"] = body.time.till.time;
    query["friday.till.division"] = body.time.till.division;
  } else if (d == 6) {
    query["saturday.working"] = true;
    query["saturday.from.time"] = body.time.from.time;
    query["saturday.from.division"] = body.time.from.division;
    query["saturday.till.time"] = body.time.till.time;
    query["saturday.till.division"] = body.time.till.division;
  }

  let capacity = await workingHourModel.findOne(query);
  if (!capacity) {
    let error: Error = new Error("Error");
    error.message = "Cannot create appointment";
    // return errorResponse(error, res);
    throw error;
  }

  body.time.date = new Date(body.time.date);
  // body.time.date = new Date(body.time.date);
  const requestDate: Date = new Date(body.time.date);
  const day = requestDate.getDay();
  if (day == 0) {
    capacity = capacity.sunday;
  } else if (day == 1) {
    capacity = capacity.monday;
  } else if (day == 2) {
    capacity = capacity.tuesday;
  } else if (day == 3) {
    capacity = capacity.wednesday;
  } else if (day == 4) {
    capacity = capacity.thursday;
  } else if (day == 5) {
    capacity = capacity.friday;
  } else if (day == 6) {
    capacity = capacity.saturday;
  }
  if (!capacity) {
    const error: Error = new Error("Doctor not available on this day");
    error.name = "Not available";
    //   return errorResponse(error, res);
    return Promise.reject(error);
  }

  let appointmentCount = await appointmentModel.find({
    doctors: body.doctors,
    hospital: body.hospital,
    "time.from.time": capacity.from.time,
    "time.till.time": capacity.till.time,
  });

  let appCount = 0;
  appointmentCount = appointmentCount.map((e: any) => {
    if (
      new Date(e.time.date).getDate() == new Date(requestDate).getDate() &&
      new Date(e.time.date).getFullYear() ==
      new Date(requestDate).getFullYear() &&
      new Date(e.time.date).getMonth() == new Date(requestDate).getMonth()
    ) {
      appCount++;
    }
  });
  if (!(appCount < capacity.capacity)) {
    //   return errorResponse(
    //     new Error("Doctor cannot take any more appointments"),
    //     res
    //   );
    return Promise.reject(
      new Error("Doctor cannot take any more appointments")
    );
  }
  return Promise.resolve(true);
};

export const getHospitalsInACity = async (
  cityId: string
): Promise<Array<Object>> => {
  const addressById: Array<any> = await addressModel.find(
    { city: cityId },
    { _id: 1 }
  );
  let addressIds: Array<string> = addressById.map((e: any) => {
    return e._id;
  });

  const hospitalsInThatCity = await hospitalModel
    .find({
      address: { $in: addressIds },
    })
    .populate({
      path: "address",
      populate: {
        path: "city state locality country",
      },
    })
    .populate({
      path: "services",
    })
    .lean();

  return hospitalsInThatCity;
};

export const isAdvancedBookingValid = (bookingDate: moment.Moment, advancedBookingPeriod: number): boolean => {
  const currentDate = moment()
  const dateDifference: number = bookingDate.diff(moment(currentDate), "days") + 1;
  return dateDifference > -1 && dateDifference <= advancedBookingPeriod
}

export const markPatientsPhoneNumberAsNotVerified = async (patient: Array<Patient>) => {
  await patientModel.updateMany({ _id: { $in: patient.map((patient: Patient) => patient.id) } }, { $set: { phoneNumberVerified: false } })
}