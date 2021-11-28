import { Response } from "express";
import mongoose from "mongoose";
export const successResponse = (
  data: Object,
  message: String,
  response: Response
) => {
  response.status(200).send({ data, message });
};

export const errorResponse = (error: Error, response: Response) => {
  response.status(400).send({ type: error.name, message: error.message });
};
