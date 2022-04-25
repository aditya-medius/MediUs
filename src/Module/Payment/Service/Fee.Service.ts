import feeModel from "../Model/Fee.Model";

export const setFee = async (name: string, feeAmount: number) => {
  try {
    let feeData = await new feeModel({
      name,
      feeAmount,
    }).save();

    return Promise.resolve(feeData);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getAllFees = async () => {
  try {
    let feeData = await feeModel.find();
    return Promise.resolve(feeData);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
