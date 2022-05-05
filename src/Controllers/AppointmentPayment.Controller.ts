import { Request, Response } from "express";
import RazorPay from "razorpay";
import { errorResponse, successResponse } from "../Services/response";
import appointmentPaymentModel from "../Models/AppointmentPayment.Model";
import * as orderController from "./Order.Controller";
import crypto from "crypto";
import creditAmountModel from "../Models/CreditAmount.Model";
import { BookAppointment } from "../Services/Patient/Patient.Service";
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
    let body = req.body.orderId + "|" + req.body.paymentId;
    let b: any = req.body;
    var expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_TEST_SECRET as string)
      .update(body.toString())
      .digest("hex");
    var response: any = { signatureIsValid: "false" };
    if (expectedSignature === req.body.paymentSignature) {
      response = { signatureIsValid: "true" };
      const appointmentBook = await BookAppointment(b.appointment);
      const { paymentId, orderId, paymentSignature, orderReceipt } = b;

      const paymentObj = await new appointmentPaymentModel({
        paymentId,
        orderId: req.body.appointmentOrderId,
        paymentSignature,
        orderReceipt,
        appointmentId: appointmentBook._id,
      }).save();

      await new creditAmountModel({
        orderId: req.body.appointmentOrderId,
        appointmentDetails: appointmentBook._id,
      }).save();
      response.paymentDetails = paymentObj;
      return successResponse(response, "Signature is valid", res);
    }

    // let body = req.body;
    // const appointmentBook = await BookAppointment(body.appointment);
    // const { paymentId, orderId, paymentSignature, orderReceipt } = body;

    // const paymentObj = await new appointmentPayment({
    //   paymentId,
    //   orderId,
    //   paymentSignature,
    //   orderReceipt,
    //   appointmentId: appointmentBook._id,
    // }).save();

    // await new creditAmountModel({
    //   orderId: req.body.orderId,
    //   appointmentDetails: appointmentBook._id,
    // }).save();
    // return successResponse(paymentObj, "Signature is valid", res);
    let error = new Error("Signature is invalid");
    error.name = "INvalid signature";
    return errorResponse(error, res);
  } catch (error) {
    return errorResponse(error, res);
  }
};
