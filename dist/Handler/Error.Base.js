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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBase = void 0;
const response_1 = require("../Services/response");
class ErrorBase {
    static handleServiceExceptions(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield originalMethod.apply(this, args);
                    return Promise.resolve(result);
                }
                catch (error) {
                    return Promise.reject(error);
                }
            });
        };
        return descriptor;
    }
    static handleResponseException(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                let [req, res, message] = args;
                message = message !== null && message !== void 0 ? message : "Success";
                try {
                    const result = yield originalMethod.apply(this, args);
                    return (0, response_1.successResponse)(result, message, res);
                }
                catch (error) {
                    return (0, response_1.errorResponse)(error, res);
                }
            });
        };
        return descriptor;
    }
}
exports.ErrorBase = ErrorBase;
