"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = void 0;
const Classes_1 = require("../Classes");
const Helpers_1 = require("../Services/Helpers");
class ErrorFactory extends Classes_1.Base {
    constructor() {
        super(...arguments);
        this._invalidValueErrorMessage = Helpers_1.ErrorMessage.invalidValueErrorMessage.toString();
        this._invalidTokenErrorMessage = Helpers_1.ErrorMessage.invalidTokenErrorMessage.toString();
        this._missingAuthToken = Helpers_1.ErrorMessage.missingAuthToken.toString();
        this._incorrectType = Helpers_1.ErrorMessage.incorrectType.toString();
    }
    createError(type, message, statusCode = 400) {
        const error = new Error(message);
        error.name = type;
        error.statusCode = statusCode;
        return error;
    }
    // Invalid value error
    set invalidValueErrorMessage(value) {
        this._invalidValueErrorMessage = this._invalidValueErrorMessage.replace("{{value}}", value);
    }
    get invalidValueErrorMessage() {
        return this._invalidValueErrorMessage;
    }
    // Invalid (auth) token error
    get invalidTokenErrorMessage() {
        return this._invalidTokenErrorMessage;
    }
    // Missing Auth token error
    get missingAuthTokenError() {
        return this._missingAuthToken;
    }
    // Incorrect Type error
    set incorrectType(val) {
        const { value, incorrectType, correctType } = val;
        this._incorrectType = this._incorrectType
            .replace("{{value}}", value)
            .replace("{{incorrectType}}", incorrectType)
            .replace("{{correctType}}", correctType);
    }
    get incorrectType() {
        return this._incorrectType;
    }
}
exports.ErrorFactory = ErrorFactory;
