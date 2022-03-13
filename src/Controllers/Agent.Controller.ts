import { Request, Response } from "express";
import { errorResponse, successResponse } from "../Services/response";
import * as agentService from "../Services/Agent/Agent.Service";

export const createAgentProfile = async (req: Request, res: Response) => {
  try {
    const data = await agentService.createAgentProfile(req.body);
    return successResponse(data, "Successfully created agent profile", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await agentService.login(req.query);
    return successResponse(data.data, data.message, res);
  } catch (error: any) {
    if (error.status) {
      let err = new Error(error.message);
      return errorResponse(err, res, error.status);
    }
    return errorResponse(error, res);
  }
};
