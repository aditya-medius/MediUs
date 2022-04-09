import approvalModel from "../../Models/Approval-Request.Model";
import { hospital, doctor } from "../schemaNames";

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
    return Promise.resolve(await changeRequestStatus(requestId, "Approved"));
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
    return Promise.resolve(await changeRequestStatus(requestId, "Approved"));
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
