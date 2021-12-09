import { Response } from "express";
export const successResponse = (
  data: Object,
  message: String,
  response: Response,
  statusCode: number = 200
) => {
  response.send({ status: statusCode, data, message });
};

export const errorResponse = (
  error: Error | any,
  response: Response,
  statusCode: number = 400
) => {
  response.send({
    status: statusCode,
    type: error.name,
    message: error.message,
  });
};
