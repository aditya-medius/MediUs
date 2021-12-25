import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../Services/response";

export const authenticateHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = <string>req.header("auth-header");
    const data: any = jwt.verify(
      authHeader,
      process.env.SECRET_HOSPITAL_KEY as string
    );
    req.currentHospital = data._id;
    next();
  } catch (error: any) {
    error.message = "Forbidden";
    return errorResponse(error, res, 403);
  }
};
