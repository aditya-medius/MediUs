"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getAdminToken = exports.handleCSV_locality = exports.handleCSV_city = exports.handleCSV_state = exports.checkIfMapExist = exports.getLocalityByCity = exports.getCityByState = exports.getStateByCountry = exports.createCityMap = exports.createStateMap = exports.createCountryMap = void 0;
const dotenv = __importStar(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const State_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/State.Map.Model"));
const Country_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/Country.Map.Model"));
const City_Map_Model_1 = __importDefault(require("../../Admin Controlled Models/City.Map.Model"));
const schemaNames_1 = require("../schemaNames");
dotenv.config();
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
const path = __importStar(require("path"));
// import * as csv from "csvtojson";
const lodash_1 = __importDefault(require("lodash"));
const csv = require("csvtojson");
const State_Model_1 = __importDefault(require("../../Admin Controlled Models/State.Model"));
const City_Model_1 = __importDefault(require("../../Admin Controlled Models/City.Model"));
const Locality_Model_1 = __importDefault(require("../../Admin Controlled Models/Locality.Model"));
const handleCSV_state = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let csvResult = yield csv().fromFile(path.join(body.destination, body.filename));
        let states = yield State_Model_1.default.insertMany(csvResult);
        return Promise.resolve(states);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.handleCSV_state = handleCSV_state;
const handleCSV_city = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let csvResult = yield csv().fromFile(path.join(body.destination, body.filename));
        let cities = yield City_Model_1.default.insertMany(csvResult);
        let states = yield State_Model_1.default
            .find({
            state_id: { $in: [...cities.map((e) => e.city_state)] },
        }, {
            state_id: 1,
        })
            .lean();
        let cityStateMapping = lodash_1.default.chain(cities)
            .groupBy("city_state")
            .map((value, key) => ({
            state: states.filter((e) => (e.state_id === key ? e._id : null))[0]
                ._id,
            city: value.map((e) => e._id),
        }))
            .value();
        cityStateMapping.forEach((e) => (0, exports.createStateMap)(e));
        return Promise.resolve({});
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.handleCSV_city = handleCSV_city;
const handleCSV_locality = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let csvResult = yield csv().fromFile(path.join(body.destination, body.filename));
        let locality = yield Locality_Model_1.default.insertMany(csvResult);
        let citites = yield City_Model_1.default
            .find({
            "city-id": {
                $in: [...locality.map((e) => e.locality_city)],
            },
        }, {
            "city-id": 1,
        })
            .lean();
        let localityCityMapping = lodash_1.default.chain(locality)
            .groupBy("locality_city")
            .map((value, key) => ({
            city: citites.filter((e) => e["city-id"] === key ? e["city-id"] : null)[0]._id,
            locality: value.map((e) => e._id),
        }))
            .value();
        localityCityMapping.forEach((e) => (0, exports.createCityMap)(e));
        return Promise.resolve({});
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.handleCSV_locality = handleCSV_locality;
/* Token */
const getAdminToken = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwt.sign(body, process.env.SECRET_ADMIN_KEY);
    return token;
});
exports.getAdminToken = getAdminToken;
