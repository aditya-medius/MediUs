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
exports.getDoctorsInAHospital = exports.getHospital = exports.getDoctorInformation = exports.getValidDateOfDoctorsSchedule = exports.getDoctorInfo = exports.getDoctors = exports.createProfile = void 0;
const Doctor_Service_1 = require("../Services/Doctor/Doctor.Service");
const doctorService = __importStar(require("../Services/Doctor/Doctor.Service"));
const response_1 = require("../Services/response");
const Suvedha_Service_1 = require("../Services/Suvedha/Suvedha.Service");
const suvedhaService = __importStar(require("../Services/Suvedha/Suvedha.Service"));
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profile = yield (0, Suvedha_Service_1.createSuvedhaProfile)(req.body);
        return (0, response_1.successResponse)(profile, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createProfile = createProfile;
const moment_1 = __importDefault(require("moment"));
const getDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = "";
        if (req.currentSuvedha) {
            userId = req.currentSuvedha;
        }
        else if (req.currentPatient) {
            userId = req.currentPatient;
        }
        let doctors = yield (0, Doctor_Service_1.getDoctorsWithAdvancedFilters)(userId, req.query);
        let response = doctors.map((e) => {
            var _a, _b, _c;
            return {
                firstName: e.firstName,
                lastName: e.lastName,
                gender: e.gender,
                specialityName: ((_a = e === null || e === void 0 ? void 0 : e.specialization) === null || _a === void 0 ? void 0 : _a.length) > 0
                    ? e.specialization[0].specialityName
                    : "",
                liked: ((_b = e === null || e === void 0 ? void 0 : e.liked) === null || _b === void 0 ? void 0 : _b.length) > 0 ? true : false,
                abbreviation: ((_c = e === null || e === void 0 ? void 0 : e.qualification) === null || _c === void 0 ? void 0 : _c.length) > 0
                    ? e.qualification
                        .filter((elem) => { var _a, _b; return ((_b = (_a = elem.qualificationName) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.abbreviation) ? true : false; })
                        .map((elem) => { var _a, _b; return (_b = (_a = elem.qualificationName) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.abbreviation; })
                        .flat()
                    : [],
                overallExperience: e.overallExperience,
                _id: e._id,
            };
        });
        return (0, response_1.successResponse)(response, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctors = getDoctors;
const getDoctorInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let doctors = yield (0, Doctor_Service_1.getDoctorById_ForSuvedha)(id);
        return (0, response_1.successResponse)(doctors, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorInfo = getDoctorInfo;
const getValidDateOfDoctorsSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId, date } = req.body;
        let data = yield doctorService.getDoctorWorkingDays(doctorId), holidays;
        if (date) {
            holidays = yield doctorService.isDateHolidayForDoctor(date, doctorId);
            doctorService.canDoctorTakeMoreAppointments(date, doctorId);
        }
        return (0, response_1.successResponse)({ workingDays: data, holidays }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getValidDateOfDoctorsSchedule = getValidDateOfDoctorsSchedule;
const getDoctorInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield doctorService.getDoctorInfo(req.body.doctorId, req.body.date);
        const WEEKDAYS = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        const time = new Date(req.body.date);
        let d = time.getDay();
        let day = WEEKDAYS[d - 1];
        data = data.map((e) => {
            var _a, _b, _c, _d;
            return {
                _id: e.hospitalDetails._id,
                fee: (_a = e.fee[0].consultationFee) === null || _a === void 0 ? void 0 : _a.min,
                hospital_name: e.hospitalDetails.name,
                Address: e.hospitalDetails.address,
                // fee:
                //   e?.hospitalDetails?.prescription?.length > 0
                //     ? e?.hospitalDetails.prescription?.find(
                //         (elem: any) =>
                //           elem.hospital.toString() === e.hospitalDetails._id.toString()
                //       )?.consultationFee.min
                //     : null,
                precription_validity: (_d = (_c = (_b = e === null || e === void 0 ? void 0 : e.hospitalDetails) === null || _b === void 0 ? void 0 : _b.validity) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.validateTill,
                hospital_times: (() => {
                    var _a;
                    let currentDate = (0, moment_1.default)(time).format("DD-MM-YYYY");
                    if (e[day]) {
                        let { from, till } = e[day];
                        let find = (_a = e.holidayCalendar) === null || _a === void 0 ? void 0 : _a.find((elem) => {
                            let date = (0, moment_1.default)(elem.date).format("DD-MM-YYYY");
                            return date === currentDate;
                        });
                        return [
                            {
                                available: find ? false : true,
                                Time: `${from.time}:${from.division} to ${till.time}:${till.division}`,
                            },
                        ];
                    }
                    return [
                        {
                            available: false,
                            Time: null,
                        },
                    ];
                })(),
            };
        });
        let doctorData = [];
        data.forEach((e) => {
            let exist = doctorData.find((elemt) => e._id.toString() === elemt._id.toString());
            if (!exist) {
                doctorData.push(e);
            }
        });
        return (0, response_1.successResponse)({ data: doctorData }, "Success", res);
        return (0, response_1.successResponse)({ data }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorInformation = getDoctorInformation;
const getHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { type, specialization, city } = req.query;
        return (0, response_1.successResponse)(yield suvedhaService.getHospital({ type, specialization, city }), "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getHospital = getHospital;
const getDoctorsInAHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield suvedhaService.getDoctorsInAHospital(req.body.hospitalId, req.body.time);
        const WEEKDAYS = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        let day = new Date(req.body.time).getDay();
        let doctors = data.map((e) => {
            var _a;
            let doc = e.doctors;
            return {
                id: doc._id,
                name: `${doc.firstName} ${doc.lastName}`,
                qualification: doc.qualificationName,
                experience: doc.overallExperience,
                fee: doc.fee[0].consultationFee.min,
                hopsital_times: (_a = doc === null || doc === void 0 ? void 0 : doc.working) === null || _a === void 0 ? void 0 : _a.map((elem) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    let [_id, doctorDetails, hospitalDetails, rest, byHospital, deleted, __v,] = Object.keys(elem);
                    let available = true;
                    if (doc.holiday.length > 0) {
                        if (WEEKDAYS[day] === rest) {
                            available = false;
                        }
                    }
                    return {
                        available,
                        Time: `${(_b = (_a = elem[rest]) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.time}:${(_d = (_c = elem[rest]) === null || _c === void 0 ? void 0 : _c.from) === null || _d === void 0 ? void 0 : _d.division} to ${(_f = (_e = elem[rest]) === null || _e === void 0 ? void 0 : _e.till) === null || _f === void 0 ? void 0 : _f.time}:${(_h = (_g = elem[rest]) === null || _g === void 0 ? void 0 : _g.till) === null || _h === void 0 ? void 0 : _h.division}`,
                    };
                }),
                prescription: `${doc.prescription.validateTill} Days`,
            };
        });
        // doctors = data;
        return (0, response_1.successResponse)(doctors, "Success", res);
        return (0, response_1.successResponse)(data, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getDoctorsInAHospital = getDoctorsInAHospital;
