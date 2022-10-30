import appointmentModel from "../../Models/Appointment.Model";
import mongoose from "mongoose";

export const getTokenNumber = async (body: any) => {
  try {
    let { patient, hospital, time, doctors } = body;
    let appointment = await appointmentModel.aggregate([
      {
        $match: {
          // patient: new mongoose.Types.ObjectId(patient),
          doctors: new mongoose.Types.ObjectId(doctors),
          hospital: new mongoose.Types.ObjectId(hospital),
          "time.from.time": time.from.time,
          "time.till.time": time.till.time,
        },
      },
    ]);

    /* Appointment ka filter date k base pe */
    appointment = filterAppoinmetByDate(appointment, time.date);

    return Promise.resolve(appointment.length++);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

const filterAppoinmetByDate = (appointment: Array<any>, date: Date) => {
  return appointment.filter(
    (e: any) =>
      new Date(e.time.date).getDate() == new Date(date).getDate() &&
      new Date(e.time.date).getFullYear() == new Date(date).getFullYear() &&
      new Date(e.time.date).getMonth() == new Date(date).getMonth()
  );
};

export const generateAppointmentId = () => {
  var characters = "ABCDEFGHIJKLMONPQRSTUVWXYZ0123456789";
  var result = "";
  var charactersLength = characters.length;

  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
