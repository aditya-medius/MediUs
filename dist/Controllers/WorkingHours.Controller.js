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
exports.createWorkingHours = void 0;
const WorkingHours_Model_1 = __importDefault(require("../Models/WorkingHours.Model"));
const response_1 = require("../Services/response");
const createWorkingHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body.doctorDetails = req.currentDoctor;
        const workingHour = yield WorkingHours_Model_1.default.find({
            doctorDetails: req.currentDoctor,
            // hospitalDetails: body.hospitalId,
        }, { doctorDetails: 0 });
        // Yeh poora delete ho skta hai...shayad
        workingHour.forEach((e) => {
            if (!((body.monday.from.time < e.monday.from.time &&
                body.monday.till.time < e.monday.from.time) ||
                (body.monday.from.time > e.monday.till.time &&
                    body.monday.till.time > e.monday.till.time))) {
                throw new Error("Invalid timings");
            }
            else if (!((body.tuesday.from.time < e.tuesday.from.time &&
                body.tuesday.till.time < e.tuesday.from.time) ||
                (body.tuesday.from.time > e.tuesday.till.time &&
                    body.tuesday.till.time > e.tuesday.till.time))) {
                throw new Error("Invalid timings");
            }
            else if (!((body.wednesday.from.time < e.wednesday.from.time &&
                body.wednesday.till.time < e.wednesday.from.time) ||
                (body.wednesday.from.time > e.wednesday.till.time &&
                    body.wednesday.till.time > e.wednesday.till.time))) {
                throw new Error("Invalid timings");
            }
            else if (!((body.thursday.from.time < e.thursday.from.time &&
                body.thursday.till.time < e.thursday.from.time) ||
                (body.thursday.from.time > e.thursday.till.time &&
                    body.thursday.till.time > e.thursday.till.time))) {
                throw new Error("Invalid timings");
            }
            else if (!((body.friday.from.time < e.friday.from.time &&
                body.friday.till.time < e.friday.from.time) ||
                (body.friday.from.time > e.friday.till.time &&
                    body.friday.till.time > e.friday.till.time))) {
                throw new Error("Invalid timings");
            }
            else if (!((body.saturday.from.time < e.saturday.from.time &&
                body.saturday.till.time < e.saturday.from.time) ||
                (body.saturday.from.time > e.saturday.till.time &&
                    body.saturday.till.time > e.saturday.till.time))) {
                throw new Error("Invalid timings");
            }
            else if (!((body.sunday.from.time < e.sunday.from.time &&
                body.sunday.till.time < e.sunday.from.time) ||
                (body.sunday.from.time > e.sunday.till.time &&
                    body.sunday.till.time > e.sunday.till.time))) {
                throw new Error("Invalid timings");
            }
        });
        const WHObj = yield new WorkingHours_Model_1.default(body).save();
        return (0, response_1.successResponse)(WHObj, "Successfully created", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createWorkingHours = createWorkingHours;
function timeLessThan(t1, t2) {
    console.log("t1: ", t1, "\nt2: ", t2);
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
