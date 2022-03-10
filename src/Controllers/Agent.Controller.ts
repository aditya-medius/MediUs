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
