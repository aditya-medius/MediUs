"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const Error_Base_1 = require("./Error.Base");
class ErrorHandler extends Error_Base_1.ErrorBase {
    static handleException(level = "service") {
        switch (level) {
            case "service": {
                return ErrorHandler.handleServiceExceptions;
            }
            case "response": {
                return ErrorHandler.handleResponseException;
            }
            default: {
                return (target, propertyKey, descriptor) => descriptor;
            }
        }
    }
}
exports.ErrorHandler = ErrorHandler;
