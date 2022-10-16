import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../Services/response";

export const authenticateSuvedha = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = <string>req.header("auth-header");
    const data: any = jwt.verify(
      authHeader,
      process.env.SECRET_SUVEDHA_KEY as string
    );
    req.currentSuvedha = data._id;
    return true;
  } catch (error: any) {
    return false;
  }
};
