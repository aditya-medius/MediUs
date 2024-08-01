"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UserType = exports.Weekdays = void 0;
exports.Weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];
var UserType;
(function (UserType) {
    UserType["HOSPITAL"] = "hospital";
    UserType["DOCTOR"] = "doctor";
    UserType["PATIENT"] = "patient";
})(UserType = exports.UserType || (exports.UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["ONHOLD"] = "onhold";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
