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
exports.createOpeningHours = exports.createWorkingHours = void 0;
const WorkingHours_Model_1 = __importDefault(require("../Models/WorkingHours.Model"));
const response_1 = require("../Services/response");
const time_class_1 = require("../Services/time.class");
// For Doctors
const createWorkingHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.doctorDetails = req.currentDoctor;
        let workingHour = yield WorkingHours_Model_1.default.find({
            doctorDetails: req.currentDoctor,
            hospitalDetails: body.hospitalDetails,
        }, { doctorDetails: 0, hospitalDetails: 0 });
        const { doctorDetails, hospitalDetails } = body, tempBody = __rest(body, ["doctorDetails", "hospitalDetails"]);
        workingHour.forEach((e) => {
            Object.keys(e.toJSON()).forEach((elem) => {
                if (elem != "_id" && elem != "__v") {
                    const element = e[elem];
                    const e2 = tempBody[elem];
                    const t1_from = new time_class_1.time(e2.from.time, e2.from.division);
                    const t1_till = new time_class_1.time(e2.till.time, e2.till.division);
                    const t2_from = new time_class_1.time(element.from.time, element.from.division);
                    const t2_till = new time_class_1.time(element.till.time, element.till.division);
                    if (!((t2_from.lessThan(t1_from) && t2_till.lessThan(t1_from)) ||
                        (t2_from.greaterThan(t1_till) && t2_till.greaterThan(t1_till)))) {
                        throw new Error("Invalid timings");
                    }
                }
            });
        });
        const WHObj = yield new WorkingHours_Model_1.default(body).save();
        // return successResponse({}, "Successfully created", res);
        return (0, response_1.successResponse)(WHObj, "Successfully created", res);
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
