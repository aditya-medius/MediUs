"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const options = { discriminatorKey: "kind" };
const schemaPath = {
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    DOB: {
        type: Date,
        required: true,
    },
    WhatsappNumber: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    Appointments: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "appointment",
    },
    verified: {
        type: Boolean,
        default: false,
    },
};
const userSchema = new mongoose_1.Schema(schemaPath);
userSchema.pre("save", function (next) {
    this.WhatsappNumber = this.get("phoneNumber");
    next();
});
// User Model
const userModel = (0, mongoose_1.model)("user", userSchema);
// Doctor Model
// const doctorModel = userModel.discriminator(
//   "doctor",
//   new Schema({
//     hospitals: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "hospital",
//       },
//     ],
//     specialization: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "speciality",
//       },
//     ],
//     panCard: {
//       type: String,
//       required: true,
//     },
//     qualification: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "qualification",
//       },
//     ],
//   })
// );
// const patientModel = userModel.discriminator("patient", new Schema({}));
exports.default = userModel;
