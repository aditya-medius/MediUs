"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, message, response, statusCode = 200) => {
    response.send({ status: statusCode, data, message });
};
exports.successResponse = successResponse;
const errorResponse = (error, response, statusCode = 400) => {
    response.send({
        status: statusCode,
        type: error.name,
        message: error.message,
    });
};
exports.errorResponse = errorResponse;
