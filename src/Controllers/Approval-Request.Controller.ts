import { Request, Response } from "express";
import * as approvalService from "../Services/Approval-Request/Approval-Request.Service";
import { errorResponse, successResponse } from "../Services/response";
import * as notificationService from "../Services/Notification/Notification.Service";
import doctorModel from "../Models/Doctors.Model";

export const requestApprovalFromDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    let { doctorId, hospitalId } = req.body;
    let exist = await approvalService.doctorKLiyeHospitalKiRequestExistKrtiHai(
      doctorId,
      hospitalId
    );

    let response = await approvalService.requestApprovalFromDoctor(
      doctorId,
      hospitalId
    );

    notificationService.sendApprovalRequestNotificationToDoctor_FromHospital(
      hospitalId,
      doctorId
    );
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const approveHospitalRequest = async (req: Request, res: Response) => {
  try {
    let { requestId } = req.body;
    let exist = await approvalService.checkIfNotificationExist(requestId);
    if (exist) {
      requestId = await approvalService.getRequestIdFromNotificationId(
        requestId
      );
    }
    let requestExist = await approvalService.canThisDoctorApproveThisRequest(
      requestId,
      req.currentDoctor
    );

    if (requestExist) {
      let response = await approvalService.approveHospitalRequest(requestId);

      let notificationId = await approvalService.getNotificationFromRequestId(
        requestId
      );

      await approvalService.updateNotificationReadStatus(notificationId);
      return successResponse(response, "Success", res);
    } else {
      throw new Error(
        "Either this request does not exist or you are trying to approve someone else's request"
      );
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const denyHospitalRequest = async (req: Request, res: Response) => {
  try {
    // Is method me approve hospital jaisi same problem hai. Eventually yeh uske jaisa hi banega
    let { requestId } = req.body;
    requestId = await approvalService.getRequestIdFromNotificationId(requestId);
    let response = await approvalService.denyHospitalRequest(requestId);

    approvalService.updateNotificationReadStatus(req.body.requestId);
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const requestApprovalFromHospital = async (
  req: Request,
  res: Response
) => {
  try {
    let { doctorId, hospitalId } = req.body;

    await approvalService.checkIfHospitalAlreadyExistInDoctor(
      hospitalId,
      doctorId
    );
    let exist = await approvalService.hospitalKLiyeDoctorKiRequestExistKrtiHai(
      doctorId,
      hospitalId
    );
    let response = await approvalService.requestApprovalFromHospital(
      doctorId,
      hospitalId
    );

    notificationService.sendApprovalRequestNotificationToHospital_FromDoctor(
      doctorId,
      hospitalId
    );

    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const approveDoctorRequest = async (req: Request, res: Response) => {
  try {
    let { requestId } = req.body;

    let exist = await approvalService.checkIfNotificationExist(requestId);
    if (exist) {
      requestId = await approvalService.getRequestIdFromNotificationId(
        requestId
      );
    }

    let requestExist = await approvalService.canThisHospitalApproveThisRequest(
      requestId,
      req.currentHospital
    );

    if (requestExist) {
      let response = await approvalService.approveDoctorRequest(requestId);

      let notificationId = await approvalService.getNotificationFromRequestId(
        requestId
      );
      approvalService.updateNotificationReadStatus(notificationId);

      return successResponse(response, "Success", res);
    } else {
      throw new Error(
        "Either this request does not exist or you are trying to approve someone else's request"
      );
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const denyDoctorRequest = async (req: Request, res: Response) => {
  try {
    let { requestId } = req.body;
    let exist = await approvalService.checkIfNotificationExist(requestId);
    if (exist) {
      requestId = await approvalService.getRequestIdFromNotificationId(
        requestId
      );
    }

    let response = await approvalService.denyDoctorRequest(requestId);

    let notificationId = await approvalService.getNotificationFromRequestId(
      requestId
    );
    approvalService.updateNotificationReadStatus(notificationId);
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
