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
exports.getCityByState = exports.getStateByCountry = exports.createCityMap = exports.createStateMap = exports.createCountryMap = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const State_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/State.Map.Model"));
const Country_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/Country.Map.Model"));
const City_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/City.Map.Model"));
const schemaNames_1 = require("../schemaNames");
const createCountryMap = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let countryMap = yield checkIfCountryMapExist(body.country, body.state);
        if (countryMap) {
            return Promise.reject(new Error("Country-State map already exist"));
        }
        const countryObj = yield new Country_Map_Model_1.default(body).save();
        return Promise.resolve(countryObj);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createCountryMap = createCountryMap;
const createStateMap = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stateMap = yield checkIfStateMapExist(body.state, body.city);
        if (stateMap) {
            return Promise.reject(new Error("State-City Map already exist"));
        }
        const stateObj = yield new State_Map_Model_1.default(body).save();
        return Promise.resolve(stateObj);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createStateMap = createStateMap;
const createCityMap = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cityObj = yield new City_Map_Model_1.default(body).save();
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
        let state = body.state;
        let stateList = yield State_Map_Model_1.default.aggregate([
            {
                $match: {
                    state: new mongoose_1.default.Types.ObjectId(state),
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
                    country: {
                        $first: "$state.name",
                    },
                    state: {
                        $addToSet: "$city",
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
exports.getCityByState = getCityByState;
const checkIfCountryMapExist = (country, state) => __awaiter(void 0, void 0, void 0, function* () {
    let exist = yield Country_Map_Model_1.default.exists({ country, state });
    return Promise.resolve(exist);
});
const checkIfStateMapExist = (state, city) => __awaiter(void 0, void 0, void 0, function* () {
    let exist = yield State_Map_Model_1.default.exists({ state, city });
    return Promise.resolve(exist);
});
