"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = exports.ErrorTypes = void 0;
const Helpers_1 = require("../Services/Helpers");
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes["ValidationError"] = "ValidationError";
    ErrorTypes["NotFoundError"] = "NotFoundError";
    ErrorTypes["DatabaseError"] = "DatabaseError";
    ErrorTypes["UnauthorizedError"] = "UnauthorizedError";
    ErrorTypes["UnsupportedRequestBody"] = "UnsupportedRequestBody";
    ErrorTypes["InvalidObjectId"] = "InvalidObjectId";
    ErrorTypes["MissingAuthToken"] = "MissingAuthToken";
})(ErrorTypes = exports.ErrorTypes || (exports.ErrorTypes = {}));
class ErrorFactory {
    constructor() {
        this._invalidValueErrorMessage = Helpers_1.ErrorMessage.invalidValueErrorMessage;
        this._invalidTokenErrorMessage = Helpers_1.ErrorMessage.invalidTokenErrorMessage;
        this._missingToken = Helpers_1.ErrorMessage.missingAuthToken;
    }
    createError(type, message, statusCode = 400) {
        const error = new Error(message);
        error.name = type;
        error.statusCode = statusCode;
        return error;
    }
    // Invalid value error
    set invalidValueErrorMessage(value) {
        this._invalidValueErrorMessage.toString().replace("{{value}}", value);
    }
    get invalidValueErrorMessage() {
        return this._invalidValueErrorMessage.toString();
    }
    // Invalid (auth) token error
    get invalidTokenErrorMessage() {
        return this._invalidTokenErrorMessage.toString();
    }
    // Missing Auth token error
    get missingAuthTokenError() {
        return this._missingToken.toString();
    }
}
exports.ErrorFactory = ErrorFactory;
