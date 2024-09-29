import mongoose from 'mongoose';
import { ErrorFactory, } from "../Handler/Error.Factory";
import { ErrorTypes } from '../Services/Helpers';
import { Base } from '../Classes';
const errorFactory = new ErrorFactory()

export class ValidationHandler extends Base<ValidationHandler> {
    public validateObjectIds(...ids: Array<string>) {
        ids.forEach((id: string) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                errorFactory.invalidValueErrorMessage = "ObjectId(s)";
                const errorMessage = errorFactory.invalidValueErrorMessage;
                const error = errorFactory.createError(ErrorTypes.InvalidObjectId, errorMessage)
                throw error
            }
        })
    }
}