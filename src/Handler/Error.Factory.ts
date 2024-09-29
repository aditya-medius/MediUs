import { Base } from "../Classes"
import { ErrorMessage } from "../Services/Helpers"
import { ErrorTypes } from "../Services/Helpers/Common.enum"

export type CustomError = Error & {
    type: ErrorTypes,
    statusCode?: number
}

type FixedType = {
    value: string,
    incorrectType: string,
    correctType: string
}

export class ErrorFactory extends Base<ErrorFactory> {

    private _invalidValueErrorMessage: string = ErrorMessage.invalidValueErrorMessage.toString();
    private _invalidTokenErrorMessage: string = ErrorMessage.invalidTokenErrorMessage.toString();
    private _missingAuthToken: string = ErrorMessage.missingAuthToken.toString();
    private _incorrectType: string = ErrorMessage.incorrectType.toString();

    createError(type: ErrorTypes, message: string, statusCode = 400) {
        const error = new Error(message) as CustomError
        error.name = type
        error.statusCode = statusCode
        return error
    }

    // Invalid value error
    set invalidValueErrorMessage(value: string) {
        this._invalidValueErrorMessage = this._invalidValueErrorMessage.replace("{{value}}", value)
    }

    get invalidValueErrorMessage(): string {
        return this._invalidValueErrorMessage;
    }

    // Invalid (auth) token error
    get invalidTokenErrorMessage(): string {
        return this._invalidTokenErrorMessage;
    }

    // Missing Auth token error
    get missingAuthTokenError(): string {
        return this._missingAuthToken;
    }

    // Incorrect Type error
    set incorrectType(val: FixedType | string) {
        const { value, incorrectType, correctType } = val as FixedType
        this._incorrectType = this._incorrectType
            .replace("{{value}}", value)
            .replace("{{incorrectType}}", incorrectType)
            .replace("{{correctType}}", correctType)
    }

    get incorrectType(): string {
        return this._incorrectType
    }
}
