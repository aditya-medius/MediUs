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
exports.updateWorkingHour = exports.getWorkingHours = exports.createOpeningHours = exports.createWorkingHours = void 0;
const WorkingHours_Model_1 = __importDefault(require("../Models/WorkingHours.Model"));
const response_1 = require("../Services/response");
const time_class_1 = require("../Services/time.class");
const WorkingHour_helper_1 = require("../Services/WorkingHour.helper");
// For Doctors
const createWorkingHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.doctorDetails = req.currentDoctor;
        let workingHour = yield WorkingHours_Model_1.default.find({
            doctorDetails: req.currentDoctor,
            hospitalDetails: body.hospitalId,
        }, { doctorDetails: 0, hospitalDetails: 0 });
        const { hospitalId } = body, tempBody = __rest(body, ["hospitalId"]);
        if (workingHour.length >= 24) {
            let error = new Error("Cannot create more than 24 schedules");
            error.name = "Exceeded number of schedules";
            throw error;
        }
        workingHour.forEach((e) => {
            Object.keys(e.toJSON()).forEach((elem) => {
                if (WorkingHour_helper_1.dayArray.includes(elem)) {
                    const element = e[elem];
                    const e2 = tempBody.workingHour[elem];
                    if (e2) {
                        const t1_from = new time_class_1.time(e2.from.time, e2.from.division);
                        const t1_till = new time_class_1.time(e2.till.time, e2.till.division);
                        const t2_from = new time_class_1.time(element.from.time, element.from.division);
                        const t2_till = new time_class_1.time(element.till.time, element.till.division);
                        if (!((t2_from.lessThan(t1_from) && t2_till.lessThan(t1_from)) ||
                            (t2_from.greaterThan(t1_till) && t2_till.greaterThan(t1_till)))) {
                            throw new Error("Invalid timings");
                        }
                    }
                }
            });
        });
        let tb = Object.assign({}, tempBody.workingHour);
        const WHObj = yield new WorkingHours_Model_1.default(Object.assign({ doctorDetails: req.currentDoctor, hospitalDetails: body.hospitalId }, tb)).save();
        return (0, response_1.successResponse)(WHObj, "Successfully created", res);
        // return successResponse({}, "Successfully created", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createWorkingHours = createWorkingHours;
// For Hospitals
const createOpeningHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body["byHospital"] = true;
        const WHObj = yield new WorkingHours_Model_1.default(body).save();
        return (0, response_1.successResponse)(WHObj, "Successfully created", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createOpeningHours = createOpeningHours;
// Get working hours
const getWorkingHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const WHObj = yield WorkingHours_Model_1.default
            .find({
            doctorDetails: req.body.doctorDetails,
            hospitalDetails: req.body.hospitalDetails,
        }, "-byHospital -doctorDetails -hospitalDetails")
            .lean();
        let WHObj2 = [];
        if (WHObj) {
            // WHObj.map((e: any) => {
            //   for (let data in e) {
            //     if (dayArray.includes(data)) {
            //       e[data] = { ...e[data], workingHour: e["_id"] };
            //       if (WHObj2[data]) {
            //         WHObj2[data] = [...WHObj2[data], e[data]];
            //       } else {
            //         WHObj2[data] = [e[data]];
            //       }
            //     } else {
            //       WHObj2[data] = e[data];
            //     }
            //   }
            // });
            // WHObj2 = formatWorkingHour([WHObj2]);
            WHObj.map((e) => {
                for (let data in e) {
                    if (WorkingHour_helper_1.dayArray.includes(data)) {
                        let index = WHObj2.findIndex((elem) => {
                            return (elem.from.time === e[data].from.time &&
                                elem.from.division === e[data].from.division &&
                                elem.till.time === e[data].till.time &&
                                elem.till.division === e[data].till.division);
                        });
                        if (index < 0) {
                            WHObj2.push({
                                from: e[data].from,
                                till: e[data].till,
                                Days: [
                                    { day: data, capacity: e[data].capacity, id: e[data]._id },
                                ],
                            });
                        }
                        else {
                            WHObj2[index].Days.push({
                                day: data,
                                capacity: e[data].capacity,
                                id: e[data]._id,
                            });
                        }
                    }
                }
            });
            return (0, response_1.successResponse)({ workingHours: WHObj2 }, "Success", res);
        }
        else {
            return (0, response_1.successResponse)({}, "No data found", res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getWorkingHours = getWorkingHours;
const updateWorkingHour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _a = req.body, { workingHour } = _a, rest = __rest(_a, ["workingHour"]);
        let updateQuery = { $set: rest };
        let WH = yield WorkingHours_Model_1.default.find({
            _id: workingHour,
        });
        WH.forEach((e) => {
            Object.keys(e.toJSON()).forEach((elem) => {
                if (WorkingHour_helper_1.dayArray.includes(elem)) {
                    const element = e[elem];
                    const e2 = rest[elem];
                    if (e2) {
                        if (e2.working != element.working) {
                            if (e2["from"].time == element["from"].time &&
                                e2["till"].time == element["till"].time &&
                                e2["from"].division == element["from"].division &&
                                e2["till"].division == element["till"].division) {
                                return;
                            }
                            else {
                                const t1_from = new time_class_1.time(e2.from.time, e2.from.division);
                                const t1_till = new time_class_1.time(e2.till.time, e2.till.division);
                                const t2_from = new time_class_1.time(element.from.time, element.from.division);
                                const t2_till = new time_class_1.time(element.till.time, element.till.division);
                                if (!((t2_from.lessThan(t1_from) && t2_till.lessThan(t1_from)) ||
                                    (t2_from.greaterThan(t1_till) &&
                                        t2_till.greaterThan(t1_till)))) {
                                    throw new Error("Invalid timings");
                                }
                            }
                        }
                        else {
                            const t1_from = new time_class_1.time(e2.from.time, e2.from.division);
                            const t1_till = new time_class_1.time(e2.till.time, e2.till.division);
                            const t2_from = new time_class_1.time(element.from.time, element.from.division);
                            const t2_till = new time_class_1.time(element.till.time, element.till.division);
                            if (!((t2_from.lessThan(t1_from) && t2_till.lessThan(t1_from)) ||
                                (t2_from.greaterThan(t1_till) && t2_till.greaterThan(t1_till)))) {
                                throw new Error("Invalid timings");
                            }
                        }
                    }
                    else {
                        throw new Error(`Doctor's timings does not exist for the day`);
                    }
                }
            });
        });
        WH = yield WorkingHours_Model_1.default.findOneAndUpdate({
            _id: workingHour,
        }, updateQuery);
        return (0, response_1.successResponse)({}, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.updateWorkingHour = updateWorkingHour;
function timeLessThan(t1, t2) {
    if (t1.division == 1 && t2.division == 0) {
        return false;
    }
    if (t1.division == 1 && t2.division == 1) {
        if (t1.time < t2.time) {
            return true;
        }
        else if (t1.time > t2.time) {
            return false;
        }
    }
    if (t1.division == 0 && t2.division == 1) {
        return true;
    }
}
function tiemGreaterThan(t1, t2) {
    if (t1.division == 1 && t2.division == 0) {
        return true;
    }
    if (t1.division == 1 && t2.division == 1) {
        if (t1.time > t2.time) {
            return true;
        }
        else if (t1.time < t2.time) {
            return false;
        }
    }
    if (t1.division == 0 && t2.division == 1) {
        return false;
    }
}
