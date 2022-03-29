"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWorkingHour = exports.dayArray = void 0;
exports.dayArray = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];
const formatWorkingHour = (workingHours) => {
    workingHours = workingHours.map((e) => {
        return Object.keys(e).map((elem) => {
            if (exports.dayArray.includes(elem)) {
                let returnData = {
                    day: elem,
                    timings: e[elem],
                };
                if (e.workingHourId) {
                    returnData["workingHourId"] = e.workingHourId;
                }
                return returnData;
            }
        });
    });
    workingHours = workingHours.flat().filter((e) => e);
    return workingHours;
};
exports.formatWorkingHour = formatWorkingHour;
