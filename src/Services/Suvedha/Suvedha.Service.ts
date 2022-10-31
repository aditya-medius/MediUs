import suvedhaModel from "../../Models/Suvedha.Model";
import { createAddress } from "../Address/Address.Service";
import { address, hospital } from "../schemaNames";
import { Types } from "mongoose";
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

export const createCityFilterForDoctor = (cityId: string): Array<any> => {
  let query = [
    {
      $lookup: {
        from: hospital,
        localField: "hospitalDetails.hospital",
        foreignField: "_id",
        as: "hospitalDetails",
      },
    },
    {
      $unwind: "$hospitalDetails",
    },
    {
      $lookup: {
        from: address,
        localField: "hospitalDetails.address",
        foreignField: "_id",
        as: "hospitalDetails.address",
      },
    },
    {
      $match: {
        "hospitalDetails.address.city": new Types.ObjectId(cityId),
      },
    },
  ];
  return query;
};

export const createGenderFilterForDoctor = (gender: string): Array<any> => {
  let query: any = [
    {
      $match: {
        gender,
      },
    },
  ];
  return query;
};

export const createNameFilterForDoctor = (name: string) => {
  let query: any = [
    {
      $match: {
        firstName: { $regex: name, $options: "i" },
      },
    },
  ];
  return query;
};

export const createSpecilizationFilterForDoctor = (
  specializationId: string
) => {
  let query: any = [
    {
      $match: {
        specialization: specializationId,
      },
    },
  ];
  return query;
};
