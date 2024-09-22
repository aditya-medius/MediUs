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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionHandler = void 0;
const response_1 = require("../Services/response");
const mongoose_1 = __importDefault(require("mongoose"));
const Error_Factory_1 = require("./Error.Factory");
const errorFactory = new Error_Factory_1.ErrorFactory();
class ExceptionHandler {
    constructor(cb) {
        this.callback = cb;
    }
    handleResponseException(req, res, successMessage = "Success") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.callback();
                return (0, response_1.successResponse)(result, successMessage, res);
            }
            catch (error) {
                return (0, response_1.errorResponse)(error, res);
            }
        });
    }
    handleServiceExceptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.callback();
                return Promise.resolve(result);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    validateObjectIds(...ids) {
        ids.forEach((id) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                errorFactory.invalidValueErrorMessage = "ObjectId(s)";
                const errorMessage = errorFactory.invalidValueErrorMessage;
                const error = errorFactory.createError(Error_Factory_1.ErrorTypes.InvalidObjectId, errorMessage);
                throw error;
            }
        });
        return this;
    }
}
exports.ExceptionHandler = ExceptionHandler;
