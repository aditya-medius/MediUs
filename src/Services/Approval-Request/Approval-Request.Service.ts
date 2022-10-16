import { excludeDoctorFields } from "../../Controllers/Doctor.Controller";
import approvalModel from "../../Models/Approval-Request.Model";
import doctorModel from "../../Models/Doctors.Model";
import hospitalModel from "../../Models/Hospital.Model";
import notificationsModel from "../../Models/Notification.Model";
import { hospital, doctor, approvalRequest } from "../schemaNames";
import { getAge } from "../Utils";

export const requestApprovalFromDoctor = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let approvalRequest = await new approvalModel({
      /* Kaha se Request aayi hai */
      requestFrom: hospitalId,
      ref_From: hospital,

      /* Kiske liye aayi hai */
      requestTo: doctorId,
      ref_To: doctor,
    }).save();

    return Promise.resolve(approvalRequest);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const approveHospitalRequest = async (requestId: string) => {
  try {
    await changeRequestStatus(requestId, "Approved");
    let request = await approvalModel.findOne(
      { _id: requestId },
      "requestFrom requestTo"
    );
    await addDoctorAndHospitalToEachOthersProfile(
      request.requestTo,
      request.requestFrom
    );

    // return Promise.resolve(await changeRequestStatus(requestId, "Approved"));
    return Promise.resolve("Success");
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const denyHospitalRequest = async (requestId: string) => {
  try {
    return Promise.resolve(await changeRequestStatus(requestId, "Denied"));
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const requestApprovalFromHospital = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let approvalRequest = await new approvalModel({
      /* Kaha se Request aayi hai */
      requestFrom: doctorId,
      ref_From: doctor,

      /* Kiske liye aayi hai */
      requestTo: hospitalId,
      ref_To: hospital,
    }).save();
    return Promise.resolve(approvalRequest);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const approveDoctorRequest = async (requestId: string) => {
  try {
    await changeRequestStatus(requestId, "Approved");
    let request = await approvalModel
      .findOne({ _id: requestId }, "requestFrom requestTo")
      .lean();

    await addDoctorAndHospitalToEachOthersProfile(
      request.requestFrom,
      request.requestTo
    );
    return Promise.resolve(request);
    // return Promise.resolve(await changeRequestStatus(requestId, "Approved"));
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const denyDoctorRequest = async (requestId: string) => {
  try {
    return Promise.resolve(await changeRequestStatus(requestId, "Denied"));
  } catch (error: any) {
    return Promise.reject(error);
  }
};

/* Doctor ne jo approval ki request ki hai hospital se uska status */
export const checkDoctorsApprovalStatus = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let request = await approvalModel.findOne({
      requestFrom: doctorId,
      requestTo: hospitalId,
      "delData.deleted": false,
    });
    if (request) {
      return Promise.resolve(request.approvalStatus);
    } else {
      throw new Error("You have no active approval request for this hospital");
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

/* Hospital ne jo approval ki request ki hai doctor se uska status */
export const checkHospitalsApprovalStatus = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let request = await approvalModel.findOne({
      requestTo: doctorId,
      requestFrom: hospitalId,
      "delData.deleted": false,
    });
    if (request) {
      return Promise.resolve(request.approvalStatus);
    } else {
      throw new Error("You have no active approval request for this doctor");
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};
const changeRequestStatus = async (requestId: string, status: String) => {
  try {
    await approvalModel.findOneAndUpdate(
      { _id: requestId },
      { $set: { approvalStatus: status } }
    );

    return Promise.resolve({
      message: `Successfully ${status} the request`,
    });
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const canThisDoctorApproveThisRequest = async (
  requestId: string,
  doctorId: string
) => {
  try {
    const requestExist = await approvalModel.findOne({
      _id: requestId,
      requestTo: doctorId,
    });
    return Promise.resolve(requestExist);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const canThisHospitalApproveThisRequest = async (
  requestId: string,
  hospitalId: string
) => {
  try {
    const requestExist = await approvalModel.findOne({
      _id: requestId,
      requestTo: hospitalId,
    });

    return Promise.resolve(requestExist);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const hospitalKLiyeDoctorKiRequestExistKrtiHai = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let exist = await approvalModel.exists({
      requestFrom: doctorId,
      requestTo: hospitalId,
      approvalStatus: { $ne: "Approved" },
    });
    if (exist) {
      throw new Error("A request for this already exist. Please wait");
    } else {
      return Promise.resolve(true);
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const doctorKLiyeHospitalKiRequestExistKrtiHai = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let exist = await approvalModel.exists({
      requestFrom: hospitalId,
      requestTo: doctorId,
    });
    if (exist) {
      throw new Error("A request for this already exist. Please wait");
    } else {
      return Promise.resolve(true);
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

/* Doctor ko kitno ne approval k liye request ki hai */
export const getListOfRequestedApprovals_OfDoctor = async (
  doctorId: string
) => {
  try {
    let requestedApprovals = await approvalModel
      .find(
        {
          requestTo: doctorId,
          "delData.deleted": false,
        },
        "-requestTo"
      )
      .populate({
        path: "requestFrom",
        select: {
          address: 1,
          name: 1,
        },
        populate: {
          path: "address",
          populate: {
            path: "city state locality country",
          },
        },
      });
    return Promise.resolve(requestedApprovals);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

/* Doctor ne kitno se approval ki request ki hai */
export const getListOfRequestedApprovals_ByDoctor = async (
  doctorId: string
) => {
  try {
    let requestedApprovals = await approvalModel
      .find(
        {
          requestFrom: doctorId,
          "delData.deleted": false,
        },
        "-requestFrom"
      )
      .populate({
        path: "requestTo",
        select: {
          address: 1,
          name: 1,
        },
        populate: {
          path: "address",
          populate: {
            path: "city state locality country",
          },
        },
      });
    return Promise.resolve(requestedApprovals);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

const doctorFields = {
  ...excludeDoctorFields,
  hospitalDetails: 0,
  // registration: 0,
  KYCDetails: 0,
  password: 0,
};
/* Hospital ko kitno ne approval k liye request ki hai */
export const getListOfRequestedApprovals_OfHospital = async (
  hospitalId: string
) => {
  try {
    let requestedApprovals = await approvalModel
      .find({
        requestTo: hospitalId,
        approvalStatus: "Pending",
        "delData.deleted": false,
      })
      .populate({
        path: "requestFrom",
        select: doctorFields,
        populate: {
          path: "qualification specialization",
        },
      })
      .lean();
    requestedApprovals.forEach((e: any) => {
      e.requestFrom["experience"] = getAge(
        e?.requestFrom?.registration?.registrationDate
      );
    });
    return Promise.resolve(requestedApprovals);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

/* Hospital ne kitno se approval ki request ki hai */
export const getListOfRequestedApprovals_ByHospital = async (
  hospitalId: string
) => {
  try {
    let requestedApprovals = await approvalModel
      .find({
        requestFrom: hospitalId,
      })
      .populate({
        path: "requestTo",
        select: doctorFields,
        populate: {
          path: "qualification specialization",
        },
      });
    return Promise.resolve(requestedApprovals);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

const addHospitalToDoctorProfile = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let response = await doctorModel.findOneAndUpdate(
      { _id: doctorId },
      { $addToSet: { hospitalDetails: { hospital: hospitalId } } }
    );

    return Promise.resolve(true);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

const addDoctorToHospitalProfile = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let response = await hospitalModel.findOneAndUpdate(
      { _id: hospitalId },
      { $addToSet: { doctors: doctorId } }
    );
    return Promise.resolve(true);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

const addDoctorAndHospitalToEachOthersProfile = async (
  doctorId: string,
  hospitalId: string
) => {
  try {
    let response = await Promise.all([
      addHospitalToDoctorProfile(doctorId, hospitalId),
      addDoctorToHospitalProfile(doctorId, hospitalId),
    ]);
    if (response.includes(false)) {
      throw new Error("Unexpected error occured");
    } else {
      return Promise.resolve(true);
    }
    return Promise.resolve(response);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const checkIfNotificationExist = async (notificationId: string) => {
  try {
    return Promise.resolve(
      await notificationsModel.exists({ _id: notificationId })
    );
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getRequestIdFromNotificationId = async (
  notificationId: string
) => {
  try {
    let { sender, receiver } = await notificationsModel
      .findOne(
        {
          _id: notificationId,
        },
        "sender receiver"
      )
      .lean();

    let { _id } = await approvalModel
      .findOne({
        requestFrom: sender,
        requestTo: receiver,
      })
      .lean();

    return Promise.resolve(_id);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getNotificationFromRequestId = async (requestId: string) => {
  try {
    console.log("khghvhbdsds", requestId);
    let { requestFrom, requestTo } = await approvalModel
      .findOne({ _id: requestId })
      .lean();

    let { _id } = await notificationsModel
      .findOne({ sender: requestFrom, receiver: requestTo })
      .lean();

    return Promise.resolve(_id);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const updateNotificationReadStatus = async (notificationId: string) => {
  try {
    await notificationsModel.findOneAndUpdate(
      { _id: notificationId },
      {
        $set: {
          "readDetails.isRead": true,
          "readDetails.readDate": new Date(),
        },
      }
    );
  } catch (error: any) {
    return Promise.reject(error);
  }
};
export const checkIfHospitalAlreadyExistInDoctor = async (
  hospitalId: string,
  doctorId: string
) => {
  try {
    let exist = await doctorModel.exists({
      _id: doctorId,
      "hospitalDetails.hospital": hospitalId,
    });
    if (!exist) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(
        new Error("This hospital is already in doctor's profile")
      );
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};
