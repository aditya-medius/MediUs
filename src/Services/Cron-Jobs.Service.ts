import cron from "node-cron";
import doctorModel from "../Models/Doctors.Model";
import moment from "moment";
import patientModel from "../Models/Patient.Model";
import hospitalModel from "../Models/Hospital.Model";
import { checkIfHospitalHasLoggedInInThePastMonth, checkIfHospitalHasLoggedInThePastWeek, markHospitalsAccountAsInactive, markHospitalsAccountAsOnHold } from "./Hospital/Hospital.Service";
import { Doctor, Hospital, Patient, UserStatus, UserType } from "./Helpers";
import { formatHospitals } from "./Hospital/Hospital.Util";
import { formatDoctors } from "./Doctor/Doctor.Util";
import { markDoctorsPhoneNumberAsNotVerified as markDoctorsNotVerified } from "./Doctor/Doctor.Service";
import { markPatientsPhoneNumberAsNotVerified as markPatientAsNotVerfied } from "./Patient/Patient.Service"
import { markHospitalNumberAsNotverified as maskHospitalAsNotVerified } from "./Hospital/Hospital.Service"
import { formatPatients } from "./Patient/Patient.Util"

export const deleteDoctorSchedule = async () => {
  // Cron job har 10 min me chal rhi hai
  cron.schedule("0/10 * * * * *", async () => {
    const deletedDoctors = await doctorModel.find({
      deleted: true,
    });
    const todayDate = moment(new Date());
    deletedDoctors.forEach(async (e: any) => {
      let deletedDate = moment(new Date(e.deleteDate));
      let diff = Math.abs(todayDate.diff(deletedDate, "days"));
      if (diff > 15) {
        await doctorModel.findOneAndDelete({ _id: e._id });
        console.log("Doctor deleted successfully");
      } else {
        console.log("Do Nothing");
      }
    });
  });
};

export const deletePaitent = async () => {
  cron.schedule("0/10 * * * * *", async () => {
    const deletedPatient = await patientModel.find({
      deleted: true,
    });
    const todayDate = moment(new Date());
    deletedPatient.forEach(async (e: any) => {
      let deletedDate = moment(new Date(e.deleteDate));
      let diff = Math.abs(todayDate.diff(deletedDate, "days"));
      if (diff > 15) {
        await patientModel.findOneAndDelete({ _id: e._id });
        console.log("Patient deleted successfully");
      } else {
        console.log("Do Nothing");
      }
    });
  });
};

export const deleteHospital = async () => {
  cron.schedule("0/10 * * * * *", async () => {
    const deletedHospital = await hospitalModel.find({
      deleted: true,
    });
    const todayDate = moment(new Date());
    deletedHospital.forEach(async (e: any) => {
      let deletedDate = moment(new Date(e.deleteDate));
      let diff = Math.abs(todayDate.diff(deletedDate, "days"));
      if (diff > 15) {
        await hospitalModel.findOneAndDelete({ _id: e._id });
        console.log("Hospital deleted successfully");
      } else {
        console.log("Do Nothing");
      }
    });
  });
};

export const markHospitalAsOnHoldIfItHasNotLoggedInInAWeek = () => {
  const onHoldPeriod = process.env.ONHOLDJOBPERIOD as string
  cron.schedule(onHoldPeriod, async () => {
    const hospialData = await hospitalModel.find({ status: { $nin: [UserStatus.ONHOLD, UserStatus.INACTIVE] } })
    if (hospialData.length > 0) {
      const hospital: Array<Hospital> = formatHospitals(hospialData)
      const hospitalsThatHaveNotLoggedInAWeek: Array<Hospital> = checkIfHospitalHasLoggedInThePastWeek(hospital)
      markHospitalsAccountAsOnHold(hospitalsThatHaveNotLoggedInAWeek)
    }
  })
}

const markHospitalAsInactiveIfItHasBeenOnHoldForAMonth = () => {
  const inActivePeriod = process.env.INACTIVEJOBPERIOD as string
  cron.schedule(inActivePeriod, async () => {
    const hospialData = await hospitalModel.find({ status: { $ne: UserStatus.INACTIVE } })
    if (hospialData.length > 0) {
      const hospital: Array<Hospital> = formatHospitals(hospialData)
      const hospitalsThatHaveNotLoggedInAMonth: Array<Hospital> = checkIfHospitalHasLoggedInInThePastMonth(hospital)
      markHospitalsAccountAsInactive(hospitalsThatHaveNotLoggedInAMonth)
    }
  })
}

const markDoctorsPhoneNumberAsNotVerified = () => {
  const numberVerifyingPeriod = process.env.NUMBERVERIFYINGPERIOD as string
  cron.schedule(numberVerifyingPeriod, async () => {
    const doctorData = await doctorModel.find({ $or: [{ phoneNumberVerified: { $exists: false } }, { phoneNumberVerified: true }] })

    if (doctorData.length > 0) {
      const doctor: Array<Doctor> = formatDoctors(doctorData)
      markDoctorsNotVerified(doctor)
    }
  })

}

const markPatientsPhoneNumberAsNotVerified = () => {
  const numberVerifyingPeriod = process.env.NUMBERVERIFYINGPERIOD as string
  cron.schedule(numberVerifyingPeriod, async () => {
    const patientData = await patientModel.find({ $or: [{ phoneNumberVerified: { $exists: false } }, { phoneNumberVerified: true }] })

    if (patientData.length > 0) {
      const patient: Array<Patient> = formatPatients(patientData)
      markPatientAsNotVerfied(patient)
    }
  })
}

const markHospitalNumberAsNotverified = () => {
  const numberVerifyingPeriod = process.env.NUMBERVERIFYINGPERIOD as string
  cron.schedule(numberVerifyingPeriod, async () => {
    const hospitalData = await hospitalModel.find({ $or: [{ phoneNumberVerified: { $exists: false } }, { phoneNumberVerified: true }] })

    if (hospitalData.length > 0) {
      const hospital: Array<Hospital> = formatHospitals(hospitalData)
      maskHospitalAsNotVerified(hospital)
    }
  })
}

const markHospitalAsOnHoldIfItHasNotVerifiedPhoneNumber = () => {
  const onHoldPeriod = process.env.ONHOLDNUMBERJOBPERIOD as string
  cron.schedule(onHoldPeriod, async () => {
    const hospialData = await hospitalModel.find({ status: { $nin: [UserStatus.ONHOLD, UserStatus.INACTIVE] } })
    if (hospialData.length > 0) {
      const hospital: Array<Hospital> = formatHospitals(hospialData)
      const hospitalsThatHaveNotLoggedInAWeek: Array<Hospital> = checkIfHospitalHasLoggedInThePastWeek(hospital)
      markHospitalsAccountAsOnHold(hospitalsThatHaveNotLoggedInAWeek)
    }
  })
}
const markHospitalAsInactiveIfItHasNotVerifiedPhoneNumber = () => {
  const inActivePeriod = process.env.INACTIVENUMBERJOBPERIOD as string
  cron.schedule(inActivePeriod, async () => {
    const hospialData = await hospitalModel.find({ status: { $ne: UserStatus.INACTIVE } })
    if (hospialData.length > 0) {
      const hospital: Array<Hospital> = formatHospitals(hospialData)
      const hospitalsThatHaveNotLoggedInAMonth: Array<Hospital> = checkIfHospitalHasLoggedInInThePastMonth(hospital)
      markHospitalsAccountAsInactive(hospitalsThatHaveNotLoggedInAMonth)
    }
  })
}


export const cronFunctions = [
  markHospitalAsOnHoldIfItHasNotLoggedInInAWeek,
  markHospitalAsInactiveIfItHasBeenOnHoldForAMonth,
  markDoctorsPhoneNumberAsNotVerified,
  markPatientsPhoneNumberAsNotVerified,
  markHospitalNumberAsNotverified
]

// export const cronFunctions = [
//   deleteDoctorSchedule,
//   deleteHospital,
//   deletePaitent,
// ];
