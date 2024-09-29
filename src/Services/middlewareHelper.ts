import { NextFunction, Request, Response } from "express";
import { errorResponse } from "./response";
import { ErrorFactory } from "../Handler";
import { ErrorTypes } from "./Helpers";

const errorFactory = new ErrorFactory();

export const oneOf = (...middlewares: any): any => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    let middlewareSuccess: boolean;
    let middlewareSuccessArray: Array<boolean> = [];
    middlewares.forEach(async (e: any) => {
      middlewareSuccess = e(req, res, next);
      middlewareSuccessArray.push(middlewareSuccess);
    });
    if (middlewareSuccessArray.indexOf(true) > -1) {
      next();
    } else {
      const errorMessage = errorFactory.invalidTokenErrorMessage;
      const error = errorFactory.createError(ErrorTypes.UnauthorizedError, errorMessage)
      return errorResponse(error, res);
    }
  };
};

export const tokenNikalo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query.token) {
    req.headers["auth-header"] = `${req.query.token}`;
    next();
  } else {
    const errorMessage = errorFactory.missingAuthTokenError
    const error = errorFactory.createError(ErrorTypes.MissingAuthToken, errorMessage)
    return errorResponse(error, res);
  }
};
