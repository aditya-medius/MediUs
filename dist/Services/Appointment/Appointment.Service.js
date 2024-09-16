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
exports.generateAppointmentId = exports.getTokenNumber = void 0;
const Appointment_Model_1 = __importDefault(require("../../Models/Appointment.Model"));
const mongoose_1 = __importDefault(require("mongoose"));
const getTokenNumber = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { patient, hospital, time, doctors, appointmentType } = body;
        let appointment = yield Appointment_Model_1.default.aggregate([
            {
                $match: {
                    // patient: new mongoose.Types.ObjectId(patient),
                    doctors: new mongoose_1.default.Types.ObjectId(doctors),
                    hospital: new mongoose_1.default.Types.ObjectId(hospital),
                    "time.from.time": time.from.time,
                    "time.till.time": time.till.time,
                    // appointmentType
                },
            },
        ]);
        /* Appointment ka filter date k base pe */
        appointment = filterAppoinmetByDate(appointment, time.date);
        return Promise.resolve(appointment.length++);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getTokenNumber = getTokenNumber;
const filterAppoinmetByDate = (appointment, date) => {
    return appointment.filter((e) => new Date(e.time.date).getDate() == new Date(date).getDate() &&
        new Date(e.time.date).getFullYear() == new Date(date).getFullYear() &&
        new Date(e.time.date).getMonth() == new Date(date).getMonth());
};
const generateAppointmentId = () => {
    var characters = "ABCDEFGHIJKLMONPQRSTUVWXYZ0123456789";
    var result = "";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateAppointmentId = generateAppointmentId;
