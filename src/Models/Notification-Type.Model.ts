import mongoose, { Schema, model } from "mongoose";
import { notificationType } from "../Services/schemaNames";

/* 
   WARNING: DO NOT CHANGE THE ORDER OF THIS ARRAY.
   
   UNLESS YOU DON'T LOVE YOUR KIDS AND WON'T MIND SPENDING HOURS DEBUGGING
   OR YOU ARE SINGLE AND HAVE NO ONE TO SPEND TIME WITH.
   
   YOU HAVE BEEN WARNED.
*/
export const types = [
  /* For approval request */
  "Approval Request",
  "Request Denied",
  "Request Approved",

  /* For Appointments */
  "New Appointment",
  "Appointment Confirmation",
  "Appointment Cancellation",
  "Appointment Done",

  /* For payment */
  "Payment Processing",
  "Payment Success",
  "Payment Failed",

  /* For when admin needs to send some information */
  "From Admin",
  "Maintenance",

  /* For when if congress ever comes into power (lets pray we never have to send this to our users) */
  "Apocalypse",
];

const notificationsTypeSchema = new Schema({
  Type: {
    type: String,
    enum: types,
  },
});

const notificationTypeModel = model(notificationType, notificationsTypeSchema);

export default notificationTypeModel;
