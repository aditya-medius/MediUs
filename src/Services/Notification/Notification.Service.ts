import notificationsModel from "../../Models/Notification.Model";
import notificationTypeModel from "../../Models/Notification-Type.Model";
import { hospital, doctor, patient } from "../schemaNames";
import { NotificationContext } from "twilio/lib/rest/api/v2010/account/notification";
import { excludeDoctorFields } from "../../Controllers/Doctor.Controller";
import {
  excludeHospitalFields,
  excludePatientFields,
} from "../../Controllers/Patient.Controller";

export const sendApprovalRequestNotificationToDoctor_FromHospital = async (
  hospitalId: string,
  doctorId: string
) => {
  try {
    let notificationId = generateNotificationId();
    let notificationType = await getRelevantNotificationType(
      "Approval Request"
    );
    let n_sender = hospital;
    let n_receiver = doctor;
    let notification = await new notificationsModel({
      notificationId: notificationId,

      sender: hospitalId,
      sender_ref: n_sender,

      receiver: doctorId,
      receiver_ref: n_receiver,

      notificationType: notificationType,
    }).save();

    return Promise.resolve(notification);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const sendApprovalRequestNotificationToHospital_FromDoctor = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let notificationId = generateNotificationId(),
      notificationType = await getRelevantNotificationType("Approval Request"),
      n_sender = doctor,
      n_receiver = hospital;

    let notification = await new notificationsModel({
      notificationId: notificationId,

      sender: doctorId,
      sender_ref: n_sender,

      receiver: hospitalId,
      receiver_ref: n_receiver,

      notificationType: notificationType,
    }).save();

    return Promise.resolve(notification);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const sendAppointmentNotificationToHospitalAndDoctor_FromPatient =
  async (doctorId: string, hospitalId: string, patientId: string) => {
    try {
      let notificationType = await getRelevantNotificationType(
        "New Appointment"
      );
      let doc = [
        {
          notificationId: generateNotificationId(),
          notificationType,
          sender: patientId,
          sender_ref: patient,
          receiver: doctorId,
          receiver_ref: doctor,
        },
        {
          notificationId: generateNotificationId(),
          notificationType,
          sender: patientId,
          sender_ref: patient,
          receiver: hospitalId,
          receiver_ref: hospital,
        },
      ];

      let notification = await notificationsModel.insertMany(doc);
      return Promise.resolve(NotificationContext);
    } catch (error: any) {
      return Promise.reject(error);
    }
  };

export const sendAppointmentConfirmationNotificationToPatient = async (
  patientId: string
) => {
  try {
  } catch (error: any) {
    return Promise.reject(error);
  }
};

const hospitalFields = { ...excludeHospitalFields, services: 0, location: 0 };
const doctorFields = {
  ...excludeDoctorFields,
  hospitalDetails: 0,
  overallExperience: 0,
  qualification: 0,
  id: 0,
  specialization: 0,
  _id: 0,
};
export const getHospitalsNotification_whenSenderIsDoctor = async (
  hospitalId: string
) => {
  try {
    let notifications = await notificationsModel
      .find({ receiver: hospitalId, sender_ref: doctor })
      .populate({
        path: "sender",
        select: doctorFields,
      })
      .populate({
        path: "receiver",
        select: hospitalFields,
      });
    return Promise.resolve(notifications);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getHospitalsNotification_whenSenderIsPatient = async (
  hospitalId: string
) => {
  try {
    let notifications = await notificationsModel
      .find({ receiver: hospitalId, sender_ref: patient })
      .populate({
        path: "sender",
        select: {
          ...excludePatientFields,
        },
      })
      .populate({
        path: "receiver",
        select: hospitalFields,
      });
    return Promise.resolve(notifications);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsNotification_whenSenderIsHospital = async (
  doctorId: string
) => {
  try {
    let notifications = await notificationsModel
      .find({ receiver: doctorId })
      .populate({
        path: "sender",
        select: { ...hospitalFields, ...excludePatientFields },
        populate: {
          path: "address",
          populate: {
            path: "city state locality country",
          },
        },
      })
      .populate({
        path: "receiver",
        select: doctorFields,
      });
    return Promise.resolve(notifications);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsNotification_whenSenderIsPatient = async (
  doctorId: string
) => {
  try {
    let notifications = await notificationsModel
      .find({ receiver: doctorId })
      .populate({
        path: "sender",
        select: { ...hospitalFields, ...excludePatientFields },
        populate: {
          path: "address",
          populate: {
            path: "city state locality country",
          },
        },
      })
      .populate({
        path: "receiver",
        select: doctorFields,
      });
    return Promise.resolve(notifications);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getPatientsNotification = async (patientId: string) => {
  try {
    let notifications = await notificationsModel
      .find({ receiver: patientId })
      .populate({
        path: "sender",
      })
      .populate({
        path: "receiver",
        select: doctorFields,
      });
    return Promise.resolve(notifications);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
const generateNotificationId = () => {
  var characters = "ABCDEFGHIJKLMONPQRSTUVWXYZ0123456789";
  var result = "";
  var charactersLength = characters.length;

  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const getRelevantNotificationType = async (type: string) => {
  try {
    let notificationType = await notificationTypeModel.findOne(
      {
        Type: type,
      },
      "_id"
    );
    return Promise.resolve(notificationType._id);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
