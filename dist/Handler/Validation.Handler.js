"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Error_Factory_1 = require("../Handler/Error.Factory");
const Helpers_1 = require("../Services/Helpers");
const Classes_1 = require("../Classes");
const errorFactory = new Error_Factory_1.ErrorFactory();
class ValidationHandler extends Classes_1.Base {
    validateObjectIds(...ids) {
        ids.forEach((id) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                errorFactory.invalidValueErrorMessage = "ObjectId(s)";
                const errorMessage = errorFactory.invalidValueErrorMessage;
                const error = errorFactory.createError(Helpers_1.ErrorTypes.InvalidObjectId, errorMessage);
                throw error;
            }
        });
    }
}
exports.ValidationHandler = ValidationHandler;
