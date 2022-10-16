import addressModel from "../../Models/Address.Model";
import hospitalModel from "../../Models/Hospital.Model";

export const updateAddress = async (body: any) => {
  try {
    let { hospitalId, addressId, address } = body;
    let exist = await checkIfAddressBelongToTheHospital(hospitalId, addressId);
    if (exist) {
      let updatedAddress = await addressModel.findOneAndUpdate(
        { _id: addressId },
        { $set: { ...address } },
        { new: true }
      );
      return Promise.resolve(updatedAddress);
    } else {
      return Promise.reject(new Error("This is not your address"));
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const checkIfAddressBelongToTheHospital = async (
  hospitalId: string,
  addressId: string
) => {
  try {
    let exist = await hospitalModel.findOne({
      _id: hospitalId,
      address: addressId,
    });
    if (exist) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const createAddress = async (addressInfo: Object) => {
  try {
    let addressData = await new addressModel(addressInfo).save();
    return Promise.resolve(addressData);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
