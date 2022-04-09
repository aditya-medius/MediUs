import { Request, Response } from "express";
import * as approvalService from "../Services/Approval-Request/Approval-Request.Service";
import { errorResponse, successResponse } from "../Services/response";

export const requestApprovalFromDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    let { doctorId, hospitalId } = req.body;
    let response = await approvalService.requestApprovalFromDoctor(
      doctorId,
      hospitalId
    );
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const approveHospitalRequest = async (req: Request, res: Response) => {
  try {
    let { requestId } = req.body;
    let response = await approvalService.approveHospitalRequest(requestId);
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const denyHospitalRequest = async (req: Request, res: Response) => {
  try {
    let { requestId } = req.body;
    let response = await approvalService.denyHospitalRequest(requestId);
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
    let response = await approvalService.requestApprovalFromHospital(
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
    let response = await approvalService.approveDoctorRequest(requestId);
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const denyDoctorRequest = async (req: Request, res: Response) => {
  try {
    let { requestId } = req.body;
    let response = await approvalService.denyDoctorRequest(requestId);
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
