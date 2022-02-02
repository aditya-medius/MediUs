import orderModel from "../Models/Order.Model";

export const generateOrderId = async (body: any) => {
  try {
    const receiptNumber = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    var opt = {
      amount: body.amount, // amount in the smallest currency unit
      currency: body.currency,
      receipt: `order_rcptid_${receiptNumber}`,
      appointmentDetails: body.appointment,
    };
    console.log("opt:", opt);

    const appointmentOrderId = await new orderModel(opt).save();
    const { appointmentDetails, ...options } = opt;

    return { appointmentOrderId, options, receiptNumber };
  } catch (error: any) {
    return { error };
  }
};
