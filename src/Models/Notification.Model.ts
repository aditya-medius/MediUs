import mongoose, { Schema, model } from "mongoose";
import { notifications } from "../Services/schemaNames";

const notificationsSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const notificationsModel = model(notifications, notificationsSchema);

export default notificationsModel;
