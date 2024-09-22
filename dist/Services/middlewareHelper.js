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
exports.tokenNikalo = exports.oneOf = void 0;
const response_1 = require("./response");
const Handler_1 = require("../Handler");
const errorFactory = new Handler_1.ErrorFactory();
const oneOf = (...middlewares) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let middlewareSuccess;
        let middlewareSuccessArray = [];
        middlewares.forEach((e) => __awaiter(void 0, void 0, void 0, function* () {
            middlewareSuccess = e(req, res, next);
            middlewareSuccessArray.push(middlewareSuccess);
        }));
        if (middlewareSuccessArray.indexOf(true) > -1) {
            next();
        }
        else {
            const errorMessage = errorFactory.invalidTokenErrorMessage;
            const error = errorFactory.createError(Handler_1.ErrorTypes.UnauthorizedError, errorMessage);
            return (0, response_1.errorResponse)(error, res);
        }
    });
};
exports.oneOf = oneOf;
const tokenNikalo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.token) {
        req.headers["auth-header"] = `${req.query.token}`;
        next();
    }
    else {
        const errorMessage = errorFactory.missingAuthTokenError;
        const error = errorFactory.createError(Handler_1.ErrorTypes.MissingAuthToken, errorMessage);
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.tokenNikalo = tokenNikalo;
