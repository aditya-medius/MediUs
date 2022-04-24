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
exports.deleteHolidayCalendar = exports.getDoctorsHolidayList = exports.addHolidayCalendar = void 0;
const Holiday_Calendar_Model_1 = __importDefault(require("../../Models/Holiday-Calendar.Model"));
const Utils_1 = require("../Utils");
const addHolidayCalendar = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let holidayData = yield new Holiday_Calendar_Model_1.default(body).save();
        return Promise.resolve(holidayData);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.addHolidayCalendar = addHolidayCalendar;
const getDoctorsHolidayList = (doctorId, year, month) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let [startDate, endDate] = (0, Utils_1.getRangeOfDates)(year, month);
        let holidayList = yield Holiday_Calendar_Model_1.default.find({
            doctorId,
            date: { $gte: startDate, $lt: endDate },
            "delData.deleted": false,
        }, {
            delData: 0,
        });
        return Promise.resolve(holidayList);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsHolidayList = getDoctorsHolidayList;
const deleteHolidayCalendar = (holidayId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let del_holiday = yield Holiday_Calendar_Model_1.default.findOneAndUpdate({ _id: holidayId }, { $set: { "delData.deleted": true, "delData.deletedAt": new Date() } });
        return Promise.resolve(del_holiday);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.deleteHolidayCalendar = deleteHolidayCalendar;
