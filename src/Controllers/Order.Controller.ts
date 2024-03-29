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
      otherCharges: body.otherCharges,
      // appointmentDetails: body.appointment,
    };

    const appointmentOrderId = await new orderModel(opt).save();
    const { ...options } = opt;

    return { appointmentOrderId, options, receiptNumber };
  } catch (error: any) {
    return { error };
  }
};
