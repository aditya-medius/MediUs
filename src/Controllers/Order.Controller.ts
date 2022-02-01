import { Request, Response } from "express";
import orderModel from "../Models/Order.Model";

export const createOrderId = async (body: any) => {
  try {
    const receiptNumber = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    var options = {
      amount: body.amount, // amount in the smallest currency unit
      currency: body.currency,
      receipt: `order_rcptid_${receiptNumber}`,
    };

    const orderId = await new orderModel(options).save();
    return { orderId, options, receiptNumber };
  } catch (error: any) {
    return error;
  }
};
