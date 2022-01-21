import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../Services/response";

export const authenticateHospital = (
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
    return true;
  } catch (error: any) {
    return false;
  }
};
