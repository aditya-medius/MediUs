import { Schema } from "mongoose";
import { appointment } from "./schemaNames";
const schemaOptions: any = {
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  DOB: {
    type: Date,
    // required: true,
  },
  WhatsappNumber: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
  },
  email: {
    type: String,
    required: true,
    // unique: [true, "Email already exist"],
  },
  password: {
    type: String,
    // required: true,
  },
  appointments: {
    type: Schema.Types.ObjectId,
    ref: appointment,
  },
  active: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deleteDate: {
    type: Date,
  },
};

export default schemaOptions;

// {
//   "password":"12345",
//    "KYCDetails":{
//     "panCard":"123451",
//     "bankName":"B NAME",
//     "bankAccountNumber":"123456",
//     "IFSC":"123457",
//     "adhaarCard":"123451789012"
// },
// "hospitalDetails":[
//     {
//         "hospital":"61b37ddd1619add821752b8f",
//         "workingHours":"61b4783a3679b022b8a38fce",
//         "consultationFee":{
//             "min":100,
//             "max":500
//         }
//     }
// ],
// "registration":{
//     "registrationNumber":"123456",
//     "registrationCouncil":"Registration Council",
//     "registrationDate":"Tue Nov 30 2021 22:47:17 GMT+0530 (India Standard Time)"
// },
// "email":"t1est@gmail.com",
// "phoneNumber":"8826312440",
// "DOB":"Tue Nov 30 2021 22:47:17 GMT+0530 (India Standard Time)",
// "gender":"Male",
// "lastName":"Rawat",
// "firstName":"Aditya",
// "specialization":"61b12164d8d361e50fbe26a4",
// "qualification":[
//     "61b48a386c03a1b932ffcc0b"
// ]
// }
