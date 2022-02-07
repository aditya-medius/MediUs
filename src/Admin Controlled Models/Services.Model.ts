import mongoose, { Schema, model } from "mongoose";
import { services } from "../Services/schemaNames";

const servicesSchema = new Schema({
  name: {
    type: String,
  },
  serviceType: {
    type: String,
    enum: {
      values: ["Primary", "Secondary"],
      message: "value not supported",
    },
  },
});

const servicesModel = model(services, servicesSchema);

export default servicesModel;
