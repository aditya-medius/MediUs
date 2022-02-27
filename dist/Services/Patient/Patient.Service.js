"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = exports.BookAppointment = void 0;
const Appointment_Model_1 = __importDefault(require("../../Models/Appointment.Model"));
const moment_1 = __importDefault(require("moment"));
const BookAppointment = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @TODO check if working hour exist first
        // let capacity = await workingHourModel.findOne({
        //   doctorDetails: body.doctors,
        //   hospitalDetails: body.hospital,
        // });
        // if (!capacity) {
        //   let error: Error = new Error("Error");
        //   error.message = "Cannot create appointment";
        //   // return errorResponse(error, res);
        //   throw error;
        // }
        // body.time.date = new Date(body.time.date);
        // // body.time.date = new Date(body.time.date);
        // const requestDate: Date = new Date(body.time.date);
        // const day = requestDate.getDay();
        // console.log("time::", body.time.date);
        // console.log("day:", day);
        // if (day == 0) {
        //   capacity = capacity.sunday;
        // } else if (day == 1) {
        //   capacity = capacity.monday;
        // } else if (day == 2) {
        //   capacity = capacity.tuesday;
        // } else if (day == 3) {
        //   capacity = capacity.wednesday;
        // } else if (day == 4) {
        //   capacity = capacity.thursday;
        // } else if (day == 5) {
        //   capacity = capacity.friday;
        // } else if (day == 6) {
        //   capacity = capacity.saturday;
        // }
        // if (!capacity) {
        //   const error: Error = new Error("Doctor not available on this day");
        //   error.name = "Not available";
        //   //   return errorResponse(error, res);
        //   return Promise.reject(error);
        // }
        // let appointmentCount = await appointmentModel.find({
        //   doctors: body.doctors,
        //   hospital: body.hospital,
        //   "time.from.time": capacity.from.time,
        //   "time.till.time": capacity.till.time,
        // });
        // let appCount = 0;
        // appointmentCount = appointmentCount.map((e: any) => {
        //   if (
        //     new Date(e.time.date).getDate() == new Date(requestDate).getDate() &&
        //     new Date(e.time.date).getFullYear() ==
        //       new Date(requestDate).getFullYear() &&
        //     new Date(e.time.date).getMonth() == new Date(requestDate).getMonth()
        //   ) {
        //     appCount++;
        //   }
        // });
        // if (appCount == capacity.capacity) {
        //   //   return errorResponse(
        //   //     new Error("Doctor cannot take any more appointments"),
        //   //     res
        //   //   );
        //   return Promise.reject(
        //     new Error("Doctor cannot take any more appointments")
        //   );
        // }
        let appointmentBook = yield new Appointment_Model_1.default(body).save();
        yield appointmentBook.populate({
            path: "subPatient",
            select: {
                parentPatient: 0,
            },
        });
        return Promise.resolve(appointmentBook);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.BookAppointment = BookAppointment;
const calculateAge = (DOB) => {
    const exp = (0, moment_1.default)(DOB);
    const currentDate = (0, moment_1.default)(new Date());
    let age = currentDate.diff(exp, "years", true);
    if (age < 1) {
        age = `${currentDate.diff(exp, "months")} months`;
    }
    else {
        age = `${age} years`;
    }
    return age;
};
exports.calculateAge = calculateAge;
