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
exports.BookAppointment = void 0;
const WorkingHours_Model_1 = __importDefault(require("../../Models/WorkingHours.Model"));
const Appointment_Model_1 = __importDefault(require("../../Models/Appointment.Model"));
const BookAppointment = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @TODO check if working hour exist first
        let capacity = yield WorkingHours_Model_1.default.findOne({
            doctorDetails: body.doctors,
            hospitalDetails: body.hospital,
        });
        if (!capacity) {
            let error = new Error("Error");
            error.message = "Cannot create appointment";
            // return errorResponse(error, res);
            throw error;
        }
        body.time.date = new Date(body.time.date);
        // body.time.date = new Date(body.time.date);
        const requestDate = new Date(body.time.date);
        const day = requestDate.getDay();
        if (day == 0) {
            capacity = capacity.sunday;
        }
        else if (day == 1) {
            capacity = capacity.monday;
        }
        else if (day == 2) {
            capacity = capacity.tuesday;
        }
        else if (day == 3) {
            capacity = capacity.wednesday;
        }
        else if (day == 4) {
            capacity = capacity.thursday;
        }
        else if (day == 5) {
            capacity = capacity.friday;
        }
        else if (day == 6) {
            capacity = capacity.saturday;
        }
        if (!capacity) {
            const error = new Error("Doctor not available on this day");
            error.name = "Not available";
            //   return errorResponse(error, res);
            return Promise.reject(error);
        }
        let appointmentCount = yield Appointment_Model_1.default.find({
            doctors: body.doctors,
            hospital: body.hospital,
            "time.from.time": capacity.from.time,
            "time.till.time": capacity.till.time,
        });
        let appCount = 0;
        appointmentCount = appointmentCount.map((e) => {
            if (new Date(e.time.date).getDate() == new Date(requestDate).getDate() &&
                new Date(e.time.date).getFullYear() ==
                    new Date(requestDate).getFullYear() &&
                new Date(e.time.date).getMonth() == new Date(requestDate).getMonth()) {
                appCount++;
            }
        });
        if (appCount == capacity.capacity) {
            //   return errorResponse(
            //     new Error("Doctor cannot take any more appointments"),
            //     res
            //   );
            return Promise.reject(new Error("Doctor cannot take any more appointments"));
        }
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
