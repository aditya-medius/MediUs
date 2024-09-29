"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTypes = exports.Mode = exports.ErrorMessage = exports.Gender = exports.UserStatus = exports.UserType = void 0;
const config = require("../../../config.json");
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
var ErrorMessage;
(function (ErrorMessage) {
    ErrorMessage[ErrorMessage["invalidValueErrorMessage"] = config.Error.InvalidValueMessage] = "invalidValueErrorMessage";
    ErrorMessage[ErrorMessage["invalidTokenErrorMessage"] = config.Error.InvalidTokenErrorMessage] = "invalidTokenErrorMessage";
    ErrorMessage[ErrorMessage["missingAuthToken"] = config.Error.MissingAuthToken] = "missingAuthToken";
    ErrorMessage[ErrorMessage["incorrectType"] = config.Error.IncorrectType] = "incorrectType";
})(ErrorMessage = exports.ErrorMessage || (exports.ErrorMessage = {}));
var Mode;
(function (Mode) {
    Mode["RESPONSE"] = "Response";
})(Mode = exports.Mode || (exports.Mode = {}));
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes["ValidationError"] = "ValidationError";
    ErrorTypes["NotFoundError"] = "NotFoundError";
    ErrorTypes["DatabaseError"] = "DatabaseError";
    ErrorTypes["UnauthorizedError"] = "Unauthorized";
    ErrorTypes["UnsupportedRequestBody"] = "UnsupportedRequestBody";
    ErrorTypes["InvalidObjectId"] = "InvalidObjectId";
    ErrorTypes["MissingAuthToken"] = "MissingAuthToken";
    ErrorTypes["IncorrectType"] = "IncorrectType";
})(ErrorTypes = exports.ErrorTypes || (exports.ErrorTypes = {}));
