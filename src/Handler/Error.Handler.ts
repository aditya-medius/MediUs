import { errorResponse, successResponse } from "../Services/response";
import { ErrorBase } from "./Error.Base";

export class ErrorHandler extends ErrorBase {
    static handleException(level: string = "service") {
        switch (level) {
            case "service": {
                return ErrorHandler.handleServiceExceptions
            }

            case "response": {
                return ErrorHandler.handleResponseException
            }

            default: {
                return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => descriptor;
            }
        }
    }
}
