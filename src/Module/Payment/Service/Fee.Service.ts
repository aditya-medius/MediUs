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

export const getAllFees = async (query = {}) => {
  try {
    let feeData = await feeModel.find(query);
    return Promise.resolve(feeData);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
