import cron from "node-cron";
import doctorModel from "../Models/Doctors.Model";
import moment from "moment";
import patientModel from "../Models/Patient.Model";
import hospitalModel from "../Models/Hospital.Model";

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

export const cronFunctions = [
  deleteDoctorSchedule,
  deleteHospital,
  deletePaitent,
];
