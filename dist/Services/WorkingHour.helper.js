"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWorkingHour = void 0;
const dayArray = [
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
            if (dayArray.includes(elem)) {
                return {
                    day: elem,
                    timings: e[elem],
                };
            }
        });
    });
    workingHours = workingHours.flat().filter((e) => e);
    return workingHours;
};
exports.formatWorkingHour = formatWorkingHour;
