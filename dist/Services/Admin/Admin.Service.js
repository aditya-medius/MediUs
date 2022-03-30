"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfMapExist = exports.getLocalityByCity = exports.getCityByState = exports.getStateByCountry = exports.createCityMap = exports.createStateMap = exports.createCountryMap = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const State_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/State.Map.Model"));
const Country_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/Country.Map.Model"));
const City_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/City.Map.Model"));
const schemaNames_1 = require("../schemaNames");
const createCountryMap = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mapArray = body.state.map((e) => {
            return {
                country: body.country,
                state: e,
            };
        });
        const countryObj = yield Country_Map_Model_1.default.insertMany(mapArray);
        return Promise.resolve(countryObj);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createCountryMap = createCountryMap;
const createStateMap = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mapArray = body.city.map((e) => {
            return {
                state: body.state,
                city: e,
            };
        });
        const stateObj = yield State_Map_Model_1.default.insertMany(mapArray);
        return Promise.resolve(stateObj);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createStateMap = createStateMap;
const createCityMap = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mapArray = body.locality.map((e) => {
            return {
                city: body.city,
                locality: e,
            };
        });
        const cityObj = yield City_Map_Model_1.default.insertMany(mapArray);
        return Promise.resolve(cityObj);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createCityMap = createCityMap;
const getStateByCountry = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let country = body.country;
        let stateList = yield Country_Map_Model_1.default.aggregate([
            {
                $match: {
                    country: new mongoose_1.default.Types.ObjectId(country),
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
                    from: schemaNames_1.state,
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
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getStateByCountry = getStateByCountry;
const getCityByState = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stateId = body.state;
        let cityList = yield State_Map_Model_1.default.aggregate([
            {
                $match: {
                    state: new mongoose_1.default.Types.ObjectId(stateId),
                },
            },
            {
                $lookup: {
                    from: schemaNames_1.state,
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
                    from: schemaNames_1.city,
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
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getCityByState = getCityByState;
const getLocalityByCity = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cityId = body.city;
        let locationList = yield City_Map_Model_1.default.aggregate([
            [
                {
                    $match: {
                        city: new mongoose_1.default.Types.ObjectId(cityId),
                    },
                },
                {
                    $lookup: {
                        from: schemaNames_1.city,
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
                        from: schemaNames_1.locality,
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
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getLocalityByCity = getLocalityByCity;
const checkIfMapExist = (query, model) => __awaiter(void 0, void 0, void 0, function* () {
    let children = Object.keys(query)[1];
    let exist = (yield model.find(query).lean()).map((e) => e[children].toString());
    if (exist.length === query[children]["$in"].length) {
        return Promise.resolve(true);
    }
    return Promise.resolve(query[children]["$in"].filter((e) => !exist.includes(e)));
});
exports.checkIfMapExist = checkIfMapExist;
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
