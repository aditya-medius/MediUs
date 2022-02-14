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
    // console.log("qoekjnjbd:", workingHours[0]["monday"][0]);
    workingHours = workingHours.map((e) => {
        return Object.keys(e).map((elem) => {
            if (exports.dayArray.includes(elem)) {
                // console.log("eleme:", e[elem]);
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
