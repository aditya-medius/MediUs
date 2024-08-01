"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.UserStatus = exports.UserType = exports.Weekdays = void 0;
const config = require("../../../config.json");
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
    UserType[UserType["HOSPITAL"] = config.common.UserType.hospital] = "HOSPITAL";
    UserType[UserType["DOCTOR"] = config.common.UserType.doctor] = "DOCTOR";
    UserType[UserType["PATIENT"] = config.common.UserType.patient] = "PATIENT";
})(UserType = exports.UserType || (exports.UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["ACTIVE"] = config.common.UserStatus.active] = "ACTIVE";
    UserStatus[UserStatus["ONHOLD"] = config.common.UserStatus.onhold] = "ONHOLD";
    UserStatus[UserStatus["INACTIVE"] = config.common.UserStatus.inactive] = "INACTIVE";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var Gender;
(function (Gender) {
    Gender[Gender["MALE"] = config.common.Gender.Male] = "MALE";
    Gender[Gender["FEMALE"] = config.common.Gender.Female] = "FEMALE";
})(Gender = exports.Gender || (exports.Gender = {}));
