import { ErrorMessage } from "../Services/Helpers"

export enum ErrorTypes {
    ValidationError = "ValidationError",
    NotFoundError = "NotFoundError",
    DatabaseError = "DatabaseError",
    UnauthorizedError = "Unauthorized",
    UnsupportedRequestBody = "UnsupportedRequestBody",
    InvalidObjectId = "InvalidObjectId",
    MissingAuthToken = "MissingAuthToken"
}

export type CustomError = Error & {
    type: ErrorTypes,
    statusCode?: number
}

export class ErrorFactory {

    private _invalidValueErrorMessage: ErrorMessage = ErrorMessage.invalidValueErrorMessage;
    private _invalidTokenErrorMessage: ErrorMessage = ErrorMessage.invalidTokenErrorMessage;
    private _missingToken: ErrorMessage = ErrorMessage.missingAuthToken;

    createError(type: ErrorTypes, message: string, statusCode = 400) {
        const error = new Error(message) as CustomError
        error.name = type
        error.statusCode = statusCode
        return error
    }

    // Invalid value error
    set invalidValueErrorMessage(value: string) {
        this._invalidValueErrorMessage.toString().replace("{{value}}", value)
    }

    get invalidValueErrorMessage(): string {
        return this._invalidValueErrorMessage.toString();
    }

    // Invalid (auth) token error
    get invalidTokenErrorMessage(): string {
        return this._invalidTokenErrorMessage.toString();
    }

    // Missing Auth token error
    get missingAuthTokenError(): string {
        return this._missingToken.toString();
    }
}
