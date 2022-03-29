import { encryptPassword, generateOTP, generateOTPtoken } from "../Utils";
import * as dotenv from "dotenv";
import { sendMessage } from "../message.service";
import otpModel from "../../Models/OTP.Model";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import StateMapModel from "../../Admin Controlled Models/State.Map.Model";
import CountryMapModel from "../../Admin Controlled Models/Country.Map.Model";
import cityMapModel from "../../Admin Controlled Models/City.Map.Model";
import { country, state } from "../schemaNames";
export const createCountryMap = async (body: any) => {
  try {
    let countryMap: Boolean = await checkIfCountryMapExist(
      body.country,
      body.state
    );
    if (countryMap) {
      return Promise.reject(new Error("Country-State map already exist"));
    }
    const countryObj = await new CountryMapModel(body).save();
    return Promise.resolve(countryObj);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const createStateMap = async (body: any) => {
  try {
    const stateObj = await new StateMapModel(body).save();
    return Promise.resolve(stateObj);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const createCityMap = async (body: any) => {
  try {
    const cityObj = await new cityMapModel(body).save();
    return Promise.resolve(cityObj);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getStateByCountry = async (body: any) => {
  try {
    let country = body.country;

    let stateList = await CountryMapModel.aggregate([
      {
        $match: {
          country: new mongoose.Types.ObjectId(country),
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },
      {
        $unwind: {
          path: "$country",
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "state",
          foreignField: "_id",
          as: "state",
        },
      },
      {
        $unwind: {
          path: "$state",
        },
      },
      {
        $project: {
          "state.__v": 0,
        },
      },
      {
        $group: {
          _id: "$country._id",
          country: {
            $first: "$country.name",
          },
          state: {
            $addToSet: "$state",
          },
        },
      },
    ]);
    return Promise.resolve(stateList);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

const checkIfCountryMapExist = async (
  country: string,
  state: string
): Promise<any> => {
  let exist = await CountryMapModel.exists({ country, state });
  return Promise.resolve(exist);
};
