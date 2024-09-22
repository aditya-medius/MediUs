import { errorResponse, successResponse } from "../Services/response"
import { Request, Response } from "express";
import mongoose from 'mongoose';
import { PromiseFunction } from "../Services/Helpers";
import { ErrorFactory, ErrorTypes } from "./Error.Factory";

const errorFactory = new ErrorFactory()

export class ExceptionHandler<T extends Object> {

  callback: PromiseFunction<T>

  constructor(cb: PromiseFunction<T>) {
    this.callback = cb;
  }

  async handleResponseException(req: Request, res: Response, successMessage = "Success") {
    try {
      const result: T = await this.callback();
      return successResponse(result, successMessage, res);
    } catch (error: any) {
      return errorResponse(error, res);
    }
  }

  async handleServiceExceptions(): Promise<T> {
    try {
      const result: T = await this.callback();
      return Promise.resolve(result)
    } catch (error: any) {
      return Promise.reject(error)
    }
  }

  validateObjectIds(...ids: Array<string>) {
    ids.forEach((id: string) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        errorFactory.invalidValueErrorMessage = "ObjectId(s)";
        const errorMessage = errorFactory.invalidValueErrorMessage;
        const error = errorFactory.createError(ErrorTypes.InvalidObjectId, errorMessage)
        throw error
      }
    })
    return this;
  }
}
