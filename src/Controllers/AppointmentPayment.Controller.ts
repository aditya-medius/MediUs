import { Request, Response } from "express";
import RazorPay from "razorpay";
import { errorResponse, successResponse } from "../Services/response";
import appointmentPayment from "../Models/AppointmentPayment.Model";
import * as orderController from "./Order.Controller";
import crypto from "crypto";
import creditAmountModel from "../Models/CreditAmount.Model";
export const generateOrderId = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let instance = new RazorPay({
      key_id: process.env.RAZOR_PAY_TEST_ID as string,
      key_secret: process.env.RAZOR_PAY_TEST_SECRET as string,
    });

    const { appointmentOrderId, options, receiptNumber } =
      await orderController.generateOrderId(body);

    instance.orders.create(options, function (err: any, order: any) {
      if (err) {
        return errorResponse(err, res);
      }
      return successResponse(
        {
          appointmentOrderId,
          orderId: order.id,
          orderReceipt: `order_rcptid_${receiptNumber}`,
        },
        "Order id generated",
        res
      );
    });
  } catch (e) {
    return errorResponse(e, res);
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    // let body = req.body.orderId + "|" + req.body.paymentId;

    // var expectedSignature = crypto
    //   .createHmac("sha256", process.env.RAZOR_PAY_TEST_SECRET as string)
    //   .update(body.toString())
    //   .digest("hex");
    // var response: any = { signatureIsValid: "false" };
    // if (expectedSignature === req.body.paymentSignature) {
    //   response = { signatureIsValid: "true" };
    //   const paymentObj = await new appointmentPayment(req.body);

    //   await new creditAmountModel({
    //     orderId: req.body.orderId,
    //     appointmentDetails: req.body.appointmentDetails,
    //   }).save();
    //   response.paymentDetails = paymentObj;
    //   return successResponse(response, "Signature is valid", res);
    // }
    const paymentObj = await new appointmentPayment(req.body).save();

    await new creditAmountModel({
      orderId: req.body.orderId,
      appointmentDetails: req.body.appointmentId,
    }).save();
    return successResponse(paymentObj, "Signature is valid", res);
    let error = new Error("Signature is invalid");
    error.name = "INvalid signature";
    return errorResponse(error, res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
