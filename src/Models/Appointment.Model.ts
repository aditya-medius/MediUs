import mongoose, { Schema, model } from "mongoose";
import {
  appointment,
  doctor,
  patient,
  hospital,
  subPatient,
} from "../Services/schemaNames";
import { formatWorkingHourDayForAppointment } from "../Services/Utils";
import workingHourModel from "./WorkingHours.Model";
import { AppointmentType } from "../Services/Patient";
// import schemaOptions from "../Services/schemaOptions";
const appointmentSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: patient,
  },
  doctors: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: doctor,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: hospital,
  },
  time: {
    type: {
      from: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ],
          },
          division: {
            type: Number,
          },
        },
        required: true,
      },
      till: {
        type: {
          time: {
            type: Number,
            // Time of day, like 1AM, 12PM, 10PM
            enum: [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ],
          },
          division: {
            type: Number,
          },
        },
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  subPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: subPatient,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  rescheduled: {
    type: Boolean,
    default: false,
  },
  appointmentToken: {
    type: Number,
  },
  appointmentId: {
    type: String,
  },
  Type: {
    type: String,
    enum: ["Offline", "Online"],
  },
  appointmentType: {
    type: String,
    enum: [AppointmentType.FRESH, AppointmentType.FOLLOW_UP],
    default: AppointmentType.FRESH
  },

  // Kisne appointments book ki hai. User, hospital or suvedha
  appointmentBookedBy: {
    type: String,
  },
});

appointmentSchema.post("save", async function (result: any) {
  let { doctors, hospital } = result;
  let { workingHour, day } = formatWorkingHourDayForAppointment(result);

  let updateQuery: any = {};
  if (result.done || result.cancelled) {
    /* Agar doctor ki appointment DONE ya CANCEL hone pe 
       appointmentBooked ko decrement krna hai to isko uncomment krdo
     */
    // updateQuery[`${day}.appointmentsBooked`] = -1;
    // await decrementWorkingHoursAppointmentBooked(
    //   {
    //     doctorDetails: doctors,
    //     hospitalDetails: hospital,
    //     ...workingHour,
    //   },
    //   {
    //     $inc: updateQuery,
    //   }
    // );
  } else {
    updateQuery[`${day}.appointmentsBooked`] = 1;
    await incrementWorkingHoursAppointmentBooked(
      {
        doctorDetails: doctors,
        hospitalDetails: hospital,
        ...workingHour,
      },
      {
        $inc: updateQuery,
      }
    );
  }
});

let incrementWorkingHoursAppointmentBooked = async (
  query: Object,
  increment: Object
) => {
  await workingHourModel.findOneAndUpdate(query, increment);
};

let decrementWorkingHoursAppointmentBooked = async (
  query: Object,
  decrement: Object
) => {
  await workingHourModel.findOneAndUpdate(query, decrement);
};
const appointmentModel = model(appointment, appointmentSchema);

export default appointmentModel;
