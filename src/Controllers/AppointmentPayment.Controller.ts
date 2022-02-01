import { Request, Response } from "express";
import RazorPay from "razorpay";
import { errorResponse, successResponse } from "../Services/response";
import appointmentPayment from "../Models/AppointmentPayment.Model";
import crypto from "crypto";
import * as orderController from "../Controllers/Order.Controller";
export const generateOrderId = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let instance = new RazorPay({
      key_id: process.env.RAZOR_PAY_TEST_ID as string,
      key_secret: process.env.RAZOR_PAY_TEST_SECRET as string,
    });

    // const receiptNumber = Math.floor(
    //   100000 + Math.random() * 900000
    // ).toString();

    // var options = {
    //   amount: body.amount, // amount in the smallest currency unit
    //   currency: body.currency,
    //   receipt: `order_rcptid_${receiptNumber}`,
    // };
    const { orderId, options, receiptNumber } =
      await orderController.createOrderId(body);

    instance.orders.create(options, function (err: any, order: any) {
      // console.log(order);
      if (err) {
        return errorResponse(err, res);
      }
      return successResponse(
        {
          orderId: order,
          orderReceipt: `order_rcptid_${receiptNumber}`,
          _id: orderId._id,
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
    let body = req.body.orderId + "|" + req.body.paymentId;

    var expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_TEST_SECRET as string)
      .update(body.toString())
      .digest("hex");
    var response: any = { signatureIsValid: "false" };
    if (expectedSignature === req.body.paymentSignature) {
      response = { signatureIsValid: "true" };
      const paymentObj = await new appointmentPayment(req.body);

      response.paymentDetails = paymentObj;
      return successResponse(response, "Signature is valid", res);
    }
    let error = new Error("Signature is invalid");
    error.name = "INvalid signature";
    return errorResponse(error, res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
