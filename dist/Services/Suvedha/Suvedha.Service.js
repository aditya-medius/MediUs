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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSpecialityType = exports.getDoctorsInAHospital = exports.getHospital = exports.createSpecilizationFilterForDoctor = exports.createNameFilterForDoctor = exports.createGenderFilterForDoctor = exports.createCityFilterForDoctor = exports.createSuvedhaProfile = void 0;
const Suvedha_Model_1 = __importDefault(require("../../Models/Suvedha.Model"));
const Address_Service_1 = require("../Address/Address.Service");
const schemaNames_1 = require("../schemaNames");
const mongoose_1 = require("mongoose");
const Specialization_Model_1 = __importDefault(require("../../Admin Controlled Models/Specialization.Model"));
const Doctors_Model_1 = __importDefault(require("../../Models/Doctors.Model"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
const createSuvedhaProfile = (suvedhaInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { state, city, locality, addressLine_1, pincode } = suvedhaInfo, rest = __rest(suvedhaInfo, ["state", "city", "locality", "addressLine_1", "pincode"]);
        if (state || city || locality || addressLine_1 || pincode) {
            let addressId = (yield (0, Address_Service_1.createAddress)({
                state,
                city,
                locality,
                addressLine_1,
                pincode,
            }))._id;
            rest["address"] = addressId;
        }
        // let profile = await new suvedhaModel(rest).save();
        let profile = yield Suvedha_Model_1.default.findOneAndUpdate({ _id: suvedhaInfo === null || suvedhaInfo === void 0 ? void 0 : suvedhaInfo._id }, { $set: rest }, { new: true });
        return Promise.resolve(profile);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createSuvedhaProfile = createSuvedhaProfile;
const createCityFilterForDoctor = (cityId) => {
    let query = [
        {
            $lookup: {
                from: schemaNames_1.hospital,
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
                from: schemaNames_1.address,
                localField: "hospitalDetails.address",
                foreignField: "_id",
                as: "hospitalDetails.address",
            },
        },
        {
            $match: {
                "hospitalDetails.address.city": new mongoose_1.Types.ObjectId(cityId),
            },
        },
    ];
    return query;
};
exports.createCityFilterForDoctor = createCityFilterForDoctor;
const createGenderFilterForDoctor = (gender) => {
    let query = [
        {
            $match: {
                gender,
            },
        },
    ];
    return query;
};
exports.createGenderFilterForDoctor = createGenderFilterForDoctor;
const createNameFilterForDoctor = (name) => {
    let query = [
        {
            $match: {
                firstName: { $regex: name, $options: "i" },
            },
        },
    ];
    return query;
};
exports.createNameFilterForDoctor = createNameFilterForDoctor;
const createSpecilizationFilterForDoctor = (specializationId) => {
    let query = [
        {
            $match: {
                specialization: specializationId,
            },
        },
    ];
    return query;
};
exports.createSpecilizationFilterForDoctor = createSpecilizationFilterForDoctor;
const getHospital = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { specialization, type, city } = body;
        let specializationId = yield Specialization_Model_1.default.findOne({
            specialityName: { $regex: specialization, $options: "i" },
        });
        let doctorIds = yield Doctors_Model_1.default.find({
            specialization: { $in: [specializationId._id] },
        });
        if (doctorIds.length) {
            doctorIds = doctorIds.map((e) => e._id);
        }
        let query = { doctors: { $in: doctorIds } };
        type && (query = Object.assign(Object.assign({}, query), { type }));
        let hospitals = yield Hospital_Model_1.default.find(query).populate({
            path: "address",
            populate: "city locality state country",
        });
        if (city) {
            hospitals = hospitals.filter((e) => {
                var _a, _b;
                return ((_b = (_a = e === null || e === void 0 ? void 0 : e.address) === null || _a === void 0 ? void 0 : _a.city) === null || _b === void 0 ? void 0 : _b._id.toString()) === city;
            });
        }
        hospitals = hospitals.map((e) => {
            var _a, _b;
            let address = e === null || e === void 0 ? void 0 : e.address;
            return {
                _id: e._id,
                name: e.name,
                locality: `${(_a = address === null || address === void 0 ? void 0 : address.city) === null || _a === void 0 ? void 0 : _a.name}, ${(_b = address === null || address === void 0 ? void 0 : address.locality) === null || _b === void 0 ? void 0 : _b.name}`,
                active: true,
            };
        });
        return Promise.resolve(hospitals);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getHospital = getHospital;
const getDoctorsInAHospital = (hospitalId, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const time = new Date(date);
        let year = time.getFullYear(), month = time.getMonth(), currentDate = time.getDate();
        let startDate = new Date(year, month, currentDate);
        let endDate = new Date(year, month, currentDate + 1);
        let doctors = yield Hospital_Model_1.default.aggregate([
            [
                {
                    $match: {
                        _id: new mongoose_1.Types.ObjectId(hospitalId),
                    },
                },
                {
                    $lookup: {
                        from: "doctors",
                        localField: "doctors",
                        foreignField: "_id",
                        as: "doctors",
                    },
                },
                {
                    $unwind: {
                        path: "$doctors",
                    },
                },
                {
                    $project: {
                        doctors: 1,
                    },
                },
                {
                    $lookup: {
                        from: "qualifications",
                        localField: "doctors.qualification",
                        foreignField: "_id",
                        as: "qualification",
                    },
                },
                {
                    $lookup: {
                        from: "qualificationnames",
                        localField: "qualification.qualificationName",
                        foreignField: "_id",
                        as: "qualificationName",
                    },
                },
                {
                    $addFields: {
                        "doctors.qualification": {
                            $first: "$qualification",
                        },
                    },
                },
                {
                    $addFields: {
                        "doctors.qualificationName": {
                            $first: "$qualificationName",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "workinghours",
                        localField: "_id",
                        foreignField: "hospitalDetails",
                        as: "working",
                    },
                },
                {
                    $addFields: {
                        "doctors.working": {
                            $filter: {
                                input: "$working",
                                as: "working",
                                cond: {
                                    $eq: ["$$working.doctorDetails", "$doctors._id"],
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        "doctors.fee": {
                            $filter: {
                                input: "$doctors.hospitalDetails",
                                as: "fee",
                                cond: {
                                    $eq: ["$$fee.hospital", "$_id"],
                                },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: schemaNames_1.holidayCalendar,
                        localField: "doctors._id",
                        foreignField: "doctorId",
                        as: "holiday",
                    },
                },
                {
                    $addFields: {
                        "doctors.holiday": {
                            $filter: {
                                input: "$holiday",
                                as: "holiday",
                                cond: {
                                    $eq: ["$$holiday.hospitalId", "$_id"],
                                },
                            },
                        },
                    },
                },
                // {
                //   $match: {
                //     "doctors.holiday.date": { $gte: startDate, $lte: endDate },
                //   },
                // },
                {
                    $addFields: {
                        "doctors.holiday": {
                            $filter: {
                                input: "$doctors.holiday",
                                as: "holiday",
                                cond: {
                                    $and: [
                                        {
                                            $gte: ["$$holiday.date", startDate],
                                        },
                                        {
                                            $lte: ["$$holiday.date", endDate],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: schemaNames_1.prescriptionValidity,
                        localField: "doctors._id",
                        foreignField: "doctorId",
                        as: "prescription",
                    },
                },
                {
                    $addFields: {
                        "doctors.prescription": {
                            $filter: {
                                input: "$prescription",
                                as: "prescription",
                                cond: {
                                    $eq: ["$$prescription.hospitalId", "$_id"],
                                },
                            },
                        },
                    },
                },
                {
                    $unwind: "$doctors.prescription",
                },
                {
                    $project: {
                        "doctors.working": 1,
                        "doctors.firstName": 1,
                        "doctors.lastName": 1,
                        "doctors.qualificationName": 1,
                        "doctors.overallExperience": 1,
                        "doctors._id": 1,
                        "doctors.fee": 1,
                        "doctors.holiday": 1,
                        "doctors.prescription": 1,
                    },
                },
            ],
        ]);
        return Promise.resolve(doctors);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsInAHospital = getDoctorsInAHospital;
const handleSpecialityType = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.handleSpecialityType = handleSpecialityType;
