import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../Services/response";

export const authenticateDoctor = (
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
    console.log("doctor:", req.currentDoctor);
    return true;
  } catch (error: any) {
    return false;
  }
};
