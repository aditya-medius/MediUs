import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../Services/response";

export const authenticateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = <string>req.header("auth-header");
    const data: any = jwt.verify(
      authHeader,
      process.env.SECRET_DOCTOR_KEY as string
    );
    req.currentDoctor = data._id;
    next();
  } catch (error: any) {
    error.message = "Forbidden";
    // Forbidden status code - 403
    return errorResponse(error, res, 403);
  }
};