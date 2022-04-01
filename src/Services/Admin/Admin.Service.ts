import { encryptPassword, generateOTP, generateOTPtoken } from "../Utils";
import * as dotenv from "dotenv";
import { sendMessage } from "../message.service";
import otpModel from "../../Models/OTP.Model";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import StateMapModel from "../../Admin Controlled Models/State.Map.Model";
import CountryMapModel from "../../Admin Controlled Models/Country.Map.Model";
import cityMapModel from "../../Admin Controlled Models/City.Map.Model";
import { country, state, city, locality } from "../schemaNames";
export const createCountryMap = async (body: any) => {
  try {
    let mapArray = body.state.map((e: any) => {
      return {
        country: body.country,
        state: e,
      };
    });
    const countryObj = await CountryMapModel.insertMany(mapArray);
    return Promise.resolve(countryObj);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const createStateMap = async (body: any) => {
  try {
    let mapArray = body.city.map((e: any) => {
      return {
        state: body.state,
        city: e,
      };
    });
    const stateObj = await StateMapModel.insertMany(mapArray);
    return Promise.resolve(stateObj);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const createCityMap = async (body: any) => {
  try {
    let mapArray = body.locality.map((e: any) => {
      return {
        city: body.city,
        locality: e,
      };
    });
    const cityObj = await cityMapModel.insertMany(mapArray);
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
          from: country,
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
          from: state,
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
export const getCityByState = async (body: any) => {
  try {
    let stateId = body.state;

    let cityList = await StateMapModel.aggregate([
      {
        $match: {
          state: new mongoose.Types.ObjectId(stateId),
        },
      },
      {
        $lookup: {
          from: state,
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
        $lookup: {
          from: city,
          localField: "city",
          foreignField: "_id",
          as: "city",
        },
      },
      {
        $unwind: {
          path: "$city",
        },
      },
      {
        $project: {
          "city.__v": 0,
        },
      },
      {
        $group: {
          _id: "$state._id",
          state: {
            $first: "$state.name",
          },
          city: {
            $addToSet: "$city",
          },
        },
      },
    ]);
    return Promise.resolve(cityList);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
export const getLocalityByCity = async (body: any) => {
  try {
    let cityId = body.city;

    let locationList = await cityMapModel.aggregate([
      [
        {
          $match: {
            city: new mongoose.Types.ObjectId(cityId),
          },
        },
        {
          $lookup: {
            from: city,
            localField: "city",
            foreignField: "_id",
            as: "city",
          },
        },
        {
          $unwind: {
            path: "$city",
          },
        },
        {
          $lookup: {
            from: locality,
            localField: "locality",
            foreignField: "_id",
            as: "locality",
          },
        },
        {
          $unwind: {
            path: "$locality",
          },
        },
        {
          $group: {
            _id: "$city._id",
            city: {
              $first: "$city.name",
            },
            locality: {
              $addToSet: "$locality",
            },
          },
        },
      ],
    ]);
    return Promise.resolve(locationList);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const checkIfMapExist = async (
  query: any,
  model: mongoose.Model<any, {}, {}, {}>
) => {
  let children: string = Object.keys(query)[1];
  let exist: any = (await model.find(query).lean()).map((e: any) =>
    e[children].toString()
  );

  if (exist.length === query[children]["$in"].length) {
    return Promise.resolve(true);
  }

  return Promise.resolve(
    query[children]["$in"].filter((e: any) => !exist.includes(e))
  );
};

// export const checkIfCountryMapExist = async (
//   country: string,
//   state: Array<string>
// ): Promise<any> => {
//   let exist: any = await CountryMapModel.find({
//     country,
//     state: { $in: state },
//   }).lean();
//   exist = exist.map((e: any) => e.state.toString());

//   if (exist.length === state.length) {
//     return Promise.resolve(true);
//   }
//   return Promise.resolve(state.filter((e: any) => !exist.includes(e)));
// };

// export const checkIfStateMapExist = async (
//   state: string,
//   city: string
// ): Promise<any> => {
//   let exist = await StateMapModel.exists({ state, city });
//   return Promise.resolve(exist);
// };

// export const checkIfCityMapExist = async (
//   city: string,
//   locality: string
// ): Promise<any> => {
//   let exist = await cityMapModel.exists({ city, locality });
//   return Promise.resolve(exist);
// };

import * as path from "path";
// import * as csv from "csvtojson";
const csv = require("csvtojson");
export const handleCSV = async (body: any) => {
  try {
    // console.log("csv:", csv.fromFile());
    // console.log("dssdsdsd:", body);
    let csvResult = await csv().fromFile(
      path.join(body.destination, body.filename)
    );

    return Promise.resolve(csvResult);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
