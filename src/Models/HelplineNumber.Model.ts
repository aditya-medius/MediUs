import mongoose, { Schema, model } from "mongoose";
import { helplineNumber } from "../Services/schemaNames";

const helplineNumberSchema: Schema = new Schema({
    number: {
        type: String,
        required: true
    }
});
const helpLineNumberModel = model(helplineNumber, helplineNumberSchema);
export default helpLineNumberModel;
