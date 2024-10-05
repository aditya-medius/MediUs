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
exports.markPatientsPhoneNumberAsNotVerified = exports.isAdvancedBookingValid = exports.getHospitalsInACity = exports.canDoctorTakeAppointment = exports.calculateAge = exports.BookAppointment = void 0;
const WorkingHours_Model_1 = __importDefault(require("../../Models/WorkingHours.Model"));
const Appointment_Model_1 = __importDefault(require("../../Models/Appointment.Model"));
const moment_1 = __importDefault(require("moment"));
const Appointment_Service_1 = require("../Appointment/Appointment.Service");
const Address_Model_1 = __importDefault(require("../../Models/Address.Model"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
const AdvancedBookingPeriod_1 = __importDefault(require("../../Models/AdvancedBookingPeriod"));
const Patient_Model_1 = __importDefault(require("../../Models/Patient.Model"));
const Utils_1 = require("../Utils");
const Doctors_Model_1 = __importDefault(require("../../Models/Doctors.Model"));
const BookAppointment = (body, isHospital = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rd = new Date(body.time.date);
        const d = rd.getDay();
        let b = body;
        let query = {};
        if (d == 0) {
            query["sunday.working"] = true;
            query["sunday.from.time"] = b.time.from.time;
            query["sunday.from.division"] = b.time.from.division;
            query["sunday.till.time"] = b.time.till.time;
            query["sunday.till.division"] = b.time.till.division;
        }
        else if (d == 1) {
            query["monday.working"] = true;
            query["monday.from.time"] = b.time.from.time;
            query["monday.from.division"] = b.time.from.division;
            query["monday.till.time"] = b.time.till.time;
            query["monday.till.division"] = b.time.till.division;
        }
        else if (d == 2) {
            query["tuesday.working"] = true;
            query["tuesday.from.time"] = b.time.from.time;
            query["tuesday.from.division"] = b.time.from.division;
            query["tuesday.till.time"] = b.time.till.time;
            query["tuesday.till.division"] = b.time.till.division;
        }
        else if (d == 3) {
            query["wednesday.working"] = true;
            query["wednesday.from.time"] = b.time.from.time;
            query["wednesday.from.division"] = b.time.from.division;
            query["wednesday.till.time"] = b.time.till.time;
            query["wednesday.till.division"] = b.time.till.division;
        }
        else if (d == 4) {
            query["thursday.working"] = true;
            query["thursday.from.time"] = b.time.from.time;
            query["thursday.from.division"] = b.time.from.division;
            query["thursday.till.time"] = b.time.till.time;
            query["thursday.till.division"] = b.time.till.division;
        }
        else if (d == 5) {
            query["friday.working"] = true;
            query["friday.from.time"] = b.time.from.time;
            query["friday.from.division"] = b.time.from.division;
            query["friday.till.time"] = b.time.till.time;
            query["friday.till.division"] = b.time.till.division;
        }
        else if (d == 6) {
            query["saturday.working"] = true;
            query["saturday.from.time"] = b.time.from.time;
            query["saturday.from.division"] = b.time.from.division;
            query["saturday.till.time"] = b.time.till.time;
            query["saturday.till.division"] = b.time.till.division;
        }
        let WEEK_DAYS = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        body.time.date = new Date(body.time.date);
        // body.time.date = new Date(body.time.date);
        const requestDate = new Date(body.time.date);
        const day = requestDate.getDay();
        const [working, fromDiv, fromTime, tillDiv, tillTime] = (() => {
            const workingDay = [WEEK_DAYS[day]];
            return [`${workingDay}.working`, `${workingDay}.from.division`, `${workingDay}.from.time`, `${workingDay}.till.div`, `${workingDay}.till.time`];
        })();
        console.log("body", body);
        const WorkingHourQuery = {
            doctorDetails: body.doctors,
            hospitalDetails: body.hospital,
            [working]: true,
            [fromDiv]: body.time.from.division,
            [fromTime]: body.time.from.time,
            [tillDiv]: body.time.till.division,
            [tillTime]: body.time.till.time
        };
        // @TODO check if working hour exist first
        let capacity = yield WorkingHours_Model_1.default.findOne(WorkingHourQuery);
        if (!capacity) {
            let error = new Error("Error");
            error.message = "Cannot create appointment";
            // return errorResponse(error, res);
            throw error;
        }
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
        let message = "Successfully booked appointment";
        if (!(appCount < capacity.capacity)) {
            //   return errorResponse(
            //     new Error("Doctor cannot take any more appointments"),
            //     res
            //   );
            if (isHospital) {
                message = `Doctor's appointment have exceeded doctor's capacity for the day by ${appCount - capacity.capacity + 1}`;
            }
            else {
                return Promise.reject(new Error("Doctor cannot take any more appointments"));
            }
        }
        let appointmentTokenNumber = (yield (0, Appointment_Service_1.getTokenNumber)(body)) + 1;
        let appointmentId = (0, Appointment_Service_1.generateAppointmentId)();
        body["appointmentToken"] = appointmentTokenNumber;
        body["appointmentId"] = appointmentId;
        let appointmentBook = yield new Appointment_Model_1.default(Object.assign(Object.assign({}, body), { createdAt: new Date() })).save();
        yield appointmentBook.populate({
            path: "subPatient",
            select: {
                parentPatient: 0,
            },
        });
        const doctorData = Doctors_Model_1.default.findOne({ _id: appointmentBook.doctors });
        const hospitalData = Hospital_Model_1.default.findOne({ _id: appointmentBook.hospital });
        const patientData = Patient_Model_1.default.findOne({ _id: appointmentBook.patient });
        let arr = [doctorData, hospitalData, patientData];
        Promise.all(arr).then((result) => {
            const [doctor, hospital, patient] = result;
            Utils_1.digiMilesSMS.sendAppointmentConfirmationNotification(patient.phoneNumber, `${patient.firstName} ${patient.lastName}`, `${doctor.firstName} ${doctor.lastname}`, hospital.hospitalName, (0, moment_1.default)(appointmentBook.time.date).format("DD-MM-YYYY"), `${appointmentBook.time.from.time}:${appointmentBook.time.from.division} -${appointmentBook.time.till.time}:${appointmentBook.time.till.division}`);
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
    age = parseInt(age).toFixed(2);
    if (age < 1) {
        age = `${currentDate.diff(exp, "months")} months`;
    }
    else {
        age = `${age} years`;
    }
    return age;
};
exports.calculateAge = calculateAge;
const canDoctorTakeAppointment = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const time = new Date(body.time.date);
    const bookingPeriod = yield AdvancedBookingPeriod_1.default.findOne({ doctorId: body.doctors, hospitalId: body.hospital }, "bookingPeriod");
    const advancedBookingPeriod = bookingPeriod === null || bookingPeriod === void 0 ? void 0 : bookingPeriod.bookingPeriod;
    if (bookingPeriod && !(0, exports.isAdvancedBookingValid)((0, moment_1.default)(time), advancedBookingPeriod)) {
        const error = new Error("Cannot book appointment for this day");
        error.name = "Not available";
        throw error;
    }
    let d = time.getDay();
    let query = {
        doctorDetails: body.doctors,
        hospitalDetails: body.hospital,
    };
    if (d == 0) {
        d = "sunday";
        query["sunday.working"] = true;
        query["sunday.from.time"] = body.time.from.time;
        query["sunday.from.division"] = body.time.from.division;
        query["sunday.till.time"] = body.time.till.time;
        query["sunday.till.division"] = body.time.till.division;
    }
    else if (d == 1) {
        query["monday.working"] = true;
        query["monday.from.time"] = body.time.from.time;
        query["monday.from.division"] = body.time.from.division;
        query["monday.till.time"] = body.time.till.time;
        query["monday.till.division"] = body.time.till.division;
    }
    else if (d == 2) {
        query["tuesday.working"] = true;
        query["tuesday.from.time"] = body.time.from.time;
        query["tuesday.from.division"] = body.time.from.division;
        query["tuesday.till.time"] = body.time.till.time;
        query["tuesday.till.division"] = body.time.till.division;
    }
    else if (d == 3) {
        query["wednesday.working"] = true;
        query["wednesday.from.time"] = body.time.from.time;
        query["wednesday.from.division"] = body.time.from.division;
        query["wednesday.till.time"] = body.time.till.time;
        query["wednesday.till.division"] = body.time.till.division;
    }
    else if (d == 4) {
        query["thursday.working"] = true;
        query["thursday.from.time"] = body.time.from.time;
        query["thursday.from.division"] = body.time.from.division;
        query["thursday.till.time"] = body.time.till.time;
        query["thursday.till.division"] = body.time.till.division;
    }
    else if (d == 5) {
        query["friday.working"] = true;
        query["friday.from.time"] = body.time.from.time;
        query["friday.from.division"] = body.time.from.division;
        query["friday.till.time"] = body.time.till.time;
        query["friday.till.division"] = body.time.till.division;
    }
    else if (d == 6) {
        query["saturday.working"] = true;
        query["saturday.from.time"] = body.time.from.time;
        query["saturday.from.division"] = body.time.from.division;
        query["saturday.till.time"] = body.time.till.time;
        query["saturday.till.division"] = body.time.till.division;
    }
    let capacity = yield WorkingHours_Model_1.default.findOne(query);
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
    if (!(appCount < capacity.capacity)) {
        //   return errorResponse(
        //     new Error("Doctor cannot take any more appointments"),
        //     res
        //   );
        return Promise.reject(new Error("Doctor cannot take any more appointments"));
    }
    return Promise.resolve(true);
});
exports.canDoctorTakeAppointment = canDoctorTakeAppointment;
const getHospitalsInACity = (cityId) => __awaiter(void 0, void 0, void 0, function* () {
    const addressById = yield Address_Model_1.default.find({ city: cityId }, { _id: 1 });
    let addressIds = addressById.map((e) => {
        return e._id;
    });
    const hospitalsInThatCity = yield Hospital_Model_1.default
        .find({
        address: { $in: addressIds },
    })
        .populate({
        path: "address",
        populate: {
            path: "city state locality country",
        },
    })
        .populate({
        path: "services",
    })
        .lean();
    return hospitalsInThatCity;
});
exports.getHospitalsInACity = getHospitalsInACity;
const isAdvancedBookingValid = (bookingDate, advancedBookingPeriod) => {
    const currentDate = (0, moment_1.default)();
    const dateDifference = bookingDate.diff((0, moment_1.default)(currentDate), "days") + 1;
    return dateDifference > -1 && dateDifference <= advancedBookingPeriod;
};
exports.isAdvancedBookingValid = isAdvancedBookingValid;
const markPatientsPhoneNumberAsNotVerified = (patient) => __awaiter(void 0, void 0, void 0, function* () {
    yield Patient_Model_1.default.updateMany({ _id: { $in: patient.map((patient) => patient.id) } }, { $set: { phoneNumberVerified: false } });
});
exports.markPatientsPhoneNumberAsNotVerified = markPatientsPhoneNumberAsNotVerified;
