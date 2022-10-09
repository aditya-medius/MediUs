import suvedhaModel from "../../Models/Suvedha.Model";
import { createAddress } from "../Address/Address.Service";

export const createSuvedhaProfile = async (suvedhaInfo: any) => {
  try {
    let { state, city, locality, addressLine_1, pincode, ...rest } =
      suvedhaInfo;
    if (state || city || locality || addressLine_1 || pincode) {
      let addressId = (
        await createAddress({
          state,
          city,
          locality,
          addressLine_1,
          pincode,
        })
      )._id;
      rest["address"] = addressId;
    }

    // let profile = await new suvedhaModel(rest).save();
    let profile = await suvedhaModel.findOneAndUpdate(
      { _id: suvedhaInfo?._id },
      { $set: rest },
      { new: true }
    );
    return Promise.resolve(profile);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
