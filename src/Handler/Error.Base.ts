import { errorResponse, successResponse } from "../Services/response";

export class ErrorBase {
    protected static handleServiceExceptions(target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>) {

        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            try {
                const result = await originalMethod.apply(this, args);
                return Promise.resolve(result)
            } catch (error) {
                return Promise.reject(error)
            }
        };

        return descriptor;
    }

    protected static handleResponseException(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            let [req, res, message] = args
            message = message ?? "Success";
            try {
                const result = await originalMethod.apply(this, args);
                return successResponse(result, message, res)
            } catch (error) {
                return errorResponse(error, res)
            }
        };

        return descriptor;
    }
}