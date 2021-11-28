"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, message, response) => {
    response.status(200).send({ data, message });
};
exports.successResponse = successResponse;
const errorResponse = (error, response) => {
    response.status(400).send({ type: error.name, message: error.message });
};
exports.errorResponse = errorResponse;
