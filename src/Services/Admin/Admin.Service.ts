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
dotenv.config();
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

export const createStateMap = async (body: {
  state: string;
  city: Array<string>;
}) => {
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

import * as path from "path";
// import * as csv from "csvtojson";
import _ from "lodash";
const csv = require("csvtojson");
import stateModel from "../../Admin Controlled Models/State.Model";
import cityModel from "../../Admin Controlled Models/City.Model";
import localityModel from "../../Admin Controlled Models/Locality.Model";

import { groupBy, map } from "lodash";
import specialityModel from "../../Admin Controlled Models/Specialization.Model";
export const handleCSV_state = async (body: any) => {
  try {
    let csvResult = await csv().fromFile(
      path.join(body.destination, body.filename)
    );

    let states = await stateModel.insertMany(csvResult);

    return Promise.resolve(states);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const handleCSV_city = async (body: any) => {
  try {
    let csvResult = await csv().fromFile(
      path.join(body.destination, body.filename)
    );

    let cities = await cityModel.insertMany(csvResult);

    let states = await stateModel
      .find(
        {
          state_id: { $in: [...cities.map((e: any) => e.city_state)] },
        },
        {
          state_id: 1,
        }
      )
      .lean();

    let cityStateMapping = _.chain(cities)
      .groupBy("city_state")
      .map((value, key) => ({
        state: states.filter((e: any) => (e.state_id === key ? e._id : null))[0]
          ._id,
        city: value.map((e: any) => e._id),
      }))
      .value();

    cityStateMapping.forEach((e: any) => createStateMap(e));
    return Promise.resolve({});
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const handleCSV_locality = async (body: any) => {
  try {
    let csvResult = await csv().fromFile(
      path.join(body.destination, body.filename)
    );

    let locality = await localityModel.insertMany(csvResult);

    let citites = await cityModel
      .find(
        {
          "city-id": {
            $in: [...locality.map((e: any) => e.locality_city)],
          },
        },
        {
          "city-id": 1,
        }
      )
      .lean();

    let localityCityMapping = _.chain(locality)
      .groupBy("locality_city")
      .map((value, key) => ({
        city: citites.filter((e: any) =>
          e["city-id"] === key ? e["city-id"] : null
        )[0]._id,
        locality: value.map((e: any) => e._id),
      }))
      .value();
    localityCityMapping.forEach((e: any) => createCityMap(e));
    return Promise.resolve({});
  } catch (error: any) {
    return Promise.reject(error);
  }
};

/* Token */
export const getAdminToken = async (body: any) => {
  const token = await jwt.sign(body, process.env.SECRET_ADMIN_KEY as string);
  return token;
};

export const getCityIdFromName = async (cityName: string) => {
  let city = await cityModel.findOne({ name: cityName });
  return Promise.resolve(city);
};

export const getSpecialization = async (specialization: string) => {
  specialization = await specialityModel.findOne({
    specialityName: { $regex: specialization, $options: "i" },
  });
  return Promise.resolve(specialization);
};
export const convenienceFee = 1;
