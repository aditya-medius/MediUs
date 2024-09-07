"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.formatTimings = exports.verifyPhoneNumber = exports.sendOTPToPhoneNumber = exports.getDateDifferenceFromCurrentDate = exports.getDateDifference = exports.addDays = exports.digiMilesSMS = exports.sendNotificationToPatient = exports.sendNotificationToHospital = exports.sendNotificationToDoctor = exports.firebaseAxiosPatient = exports.firebaseAxiosHospital = exports.firebaseAxiosDoctor = exports.verifyPasswordChangeOTP = exports.sendOTPForPasswordChange = exports.getRangeOfDates = exports.groupBy = exports.initUpload = exports.updateWorkingHour = exports.formatWorkingHourDayForAppointment = exports.setFormatForWorkingHours = exports.getDayFromWorkingHours = exports.getAge = exports.generateOTPtoken = exports.generateOTP = exports.encryptPassword = exports.phoneNumberRegex = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const multer_1 = __importDefault(require("multer"));
const path = __importStar(require("path"));
const OTP_Model_1 = __importDefault(require("../Models/OTP.Model"));
const axios_1 = __importDefault(require("axios"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
exports.phoneNumberRegex = /^[0]?[6789]\d{9}$/;
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cryptSalt = yield bcrypt.genSalt(10);
        let encPassword = yield bcrypt.hash(password, cryptSalt);
        return Promise.resolve(encPassword);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.encryptPassword = encryptPassword;
// export const checkPasswordHas = async (password: string) => {
//   try {
//   } catch (error: any) {
//     return Promise.reject(error);
//   }
// };
const generateOTP = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    if (exports.phoneNumberRegex.test(phoneNumber)) {
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        return Promise.resolve(OTP);
    }
    else {
        return Promise.reject("Invalid Phone Number");
    }
});
exports.generateOTP = generateOTP;
const generateOTPtoken = (OTP) => {
    const otpToken = jwt.sign({ otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 }, OTP);
    return otpToken;
};
exports.generateOTPtoken = generateOTPtoken;
const getAge = (dob) => {
    const exp = (0, moment_1.default)(new Date(dob));
    const currentDate = (0, moment_1.default)(new Date());
    let age = currentDate.diff(exp, "years", true);
    if (age < 1) {
        age = currentDate.diff(exp, "months");
        age = `${age} Months`;
    }
    else {
        age = `${age} Years`;
    }
    return age;
};
exports.getAge = getAge;
const getDayFromWorkingHours = (body) => {
    const rd = new Date(body.time.date);
    const d = rd.getDay();
    return d;
};
exports.getDayFromWorkingHours = getDayFromWorkingHours;
const setFormatForWorkingHours = (day, b) => {
    let dayArr = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    let query = {};
    query[`${dayArr[day]}.working`] = true;
    query[`${dayArr[day]}.from.time`] = b.time.from.time;
    query[`${dayArr[day]}.from.division`] = b.time.from.division;
    query[`${dayArr[day]}.till.time`] = b.time.till.time;
    query[`${dayArr[day]}.till.division`] = b.time.till.division;
    return { workingHour: query, day: dayArr[day] };
};
exports.setFormatForWorkingHours = setFormatForWorkingHours;
const formatWorkingHourDayForAppointment = (body) => {
    const d = (0, exports.getDayFromWorkingHours)(body);
    let b = body;
    let query = (0, exports.setFormatForWorkingHours)(d, b);
    // if (d == 0) {
    //   query["sunday.working"] = true;
    //   query["sunday.from.time"] = b.time.from.time;
    //   query["sunday.from.division"] = b.time.from.division;
    //   query["sunday.till.time"] = b.time.till.time;
    //   query["sunday.till.division"] = b.time.till.division;
    // } else if (d == 1) {
    //   query["monday.working"] = true;
    //   query["monday.from.time"] = b.time.from.time;
    //   query["monday.from.division"] = b.time.from.division;
    //   query["monday.till.time"] = b.time.till.time;
    //   query["monday.till.division"] = b.time.till.division;
    // } else if (d == 2) {
    //   query["tuesday.working"] = true;
    //   query["tuesday.from.time"] = b.time.from.time;
    //   query["tuesday.from.division"] = b.time.from.division;
    //   query["tuesday.till.time"] = b.time.till.time;
    //   query["tuesday.till.division"] = b.time.till.division;
    // } else if (d == 3) {
    //   query["wednesday.working"] = true;
    //   query["wednesday.from.time"] = b.time.from.time;
    //   query["wednesday.from.division"] = b.time.from.division;
    //   query["wednesday.till.time"] = b.time.till.time;
    //   query["wednesday.till.division"] = b.time.till.division;
    // } else if (d == 4) {
    //   query["thursday.working"] = true;
    //   query["thursday.from.time"] = b.time.from.time;
    //   query["thursday.from.division"] = b.time.from.division;
    //   query["thursday.till.time"] = b.time.till.time;
    //   query["thursday.till.division"] = b.time.till.division;
    // } else if (d == 5) {
    //   query["friday.working"] = true;
    //   query["friday.from.time"] = b.time.from.time;
    //   query["friday.from.division"] = b.time.from.division;
    //   query["friday.till.time"] = b.time.till.time;
    //   query["friday.till.division"] = b.time.till.division;
    // } else if (d == 6) {
    //   query["saturday.working"] = true;
    //   query["saturday.from.time"] = b.time.from.time;
    //   query["saturday.from.division"] = b.time.from.division;
    //   query["saturday.till.time"] = b.time.till.time;
    //   query["saturday.till.division"] = b.time.till.division;
    // }
    return query;
};
exports.formatWorkingHourDayForAppointment = formatWorkingHourDayForAppointment;
const updateWorkingHour = (query, cb) => { };
exports.updateWorkingHour = updateWorkingHour;
const initUpload = (filepath) => {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${filepath}`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            console.log("file.fieldname", file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
            cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
        },
    });
    const upload = (0, multer_1.default)({ storage });
    return upload;
};
exports.initUpload = initUpload;
const groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
exports.groupBy = groupBy;
const getRangeOfDates = (year, month) => {
    let startDate = new Date(new Date(year, month - 1, 1, 6, 30, 0).toUTCString());
    let endDate = new Date(new Date(year, month, 1, 6, 30, 0).toUTCString());
    return [startDate, endDate];
};
exports.getRangeOfDates = getRangeOfDates;
const sendOTPForPasswordChange = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let OTP = yield (0, exports.generateOTP)(phoneNumber);
    let otpToken = (0, exports.generateOTPtoken)(OTP);
    yield OTP_Model_1.default.findOneAndUpdate({ phoneNumber: phoneNumber, for: "PASSWORD_CHANGE" }, {
        $set: { phoneNumber: phoneNumber, otp: otpToken, for: "PASSWORD_CHANGE" },
    }, { upsert: true });
    // sendMessage(`Your OTP is: ${OTP}`, phoneNumber)
    //   .then(async (message: any) => {
    //     // Add OTP and phone number to temporary collection
    //   })
    //   .catch((error: any) => {
    //     return Promise.reject(error);
    //   });
    exports.digiMilesSMS.sendOTPToPhoneNumber(phoneNumber, OTP);
});
exports.sendOTPForPasswordChange = sendOTPForPasswordChange;
const verifyPasswordChangeOTP = (phoneNumber, OTP) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otpData = yield OTP_Model_1.default.findOne({
            phoneNumber: phoneNumber,
            for: "PASSWORD_CHANGE",
            "delData.deleted": false,
        });
        const data = jwt.verify(otpData.otp, OTP);
        if (Date.now() > data.expiresIn)
            return Promise.reject(new Error("OTP Expired"));
        if (OTP === data.otp) {
            OTP_Model_1.default.findOneAndDelete({
                phoneNumber: phoneNumber,
                for: "PASSWORD_CHANGE",
            });
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.verifyPasswordChangeOTP = verifyPasswordChangeOTP;
exports.firebaseAxiosDoctor = axios_1.default.create({
    baseURL: "https://fcm.googleapis.com",
});
exports.firebaseAxiosDoctor.interceptors.request.use((req) => {
    let headers = {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.FIREBASE_DOCTOR_API_KEY}`,
    };
    req.headers = headers;
    return req;
});
exports.firebaseAxiosHospital = axios_1.default.create({
    baseURL: "https://fcm.googleapis.com",
});
exports.firebaseAxiosHospital.interceptors.request.use((req) => {
    let headers = {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.FIREBASE_HOSPITAL_API_KEY}`,
    };
    req.headers = headers;
    return req;
});
exports.firebaseAxiosPatient = axios_1.default.create({
    baseURL: "https://fcm.googleapis.com",
});
exports.firebaseAxiosPatient.interceptors.request.use((req) => {
    let headers = {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.FIREBASE_PATIENT_API_KEY}`,
    };
    req.headers = headers;
    return req;
});
const sendNotificationToDoctor = (doctorFirebaseToken, notification) => __awaiter(void 0, void 0, void 0, function* () {
    exports.firebaseAxiosDoctor.post("/fcm/send", {
        to: doctorFirebaseToken,
        notification,
    });
});
exports.sendNotificationToDoctor = sendNotificationToDoctor;
const sendNotificationToHospital = (hospitalFirebaseToken, notification) => __awaiter(void 0, void 0, void 0, function* () {
    exports.firebaseAxiosHospital.post("/fcm/send", {
        to: hospitalFirebaseToken,
        notification,
    });
});
exports.sendNotificationToHospital = sendNotificationToHospital;
const sendNotificationToPatient = (patientFirebaseToken, notification) => __awaiter(void 0, void 0, void 0, function* () {
    exports.firebaseAxiosPatient.post("/fcm/send", {
        to: patientFirebaseToken,
        notification,
    });
});
exports.sendNotificationToPatient = sendNotificationToPatient;
exports.digiMilesSMS = {
    sendAppointmentConfirmationNotification: (phoneNumber, patientName, doctorName, hospitalName, date, time) => {
        return axios_1.default.get(`http://route.digimiles.in/bulksms/bulksms?username=DG35-medius&password=digimile&type=0&dlr=1&destination=${phoneNumber}&source=MEDUST&message=Hi, ${patientName}. Your appointment with Dr. ${doctorName} at ${hospitalName} PM has been booked on ${date} between ${time}. Team Medius.&entityid=1501583880000052401&tempid=1507166324070972086`);
    },
    sendOTPToPhoneNumber: (phoneNumber, otp) => {
        return axios_1.default.get(`http://route.digimiles.in/bulksms/bulksms?username=DG35-medius&password=digimile&type=0&dlr=1&destination=${phoneNumber}&source=MEDUST&message=${otp} is the OTP to validate your account with Medius. OTP is valid only for 60 seconds. Team Medius.&entityid=1501583880000052401&tempid=1507166324007499032`);
    },
};
const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
};
exports.addDays = addDays;
const getDateDifference = (date1, date2) => {
    date2 = (0, moment_1.default)(date2);
    date1 = (0, moment_1.default)(date1);
    const difference = date2.diff(date1, "days");
    return difference;
};
exports.getDateDifference = getDateDifference;
const getDateDifferenceFromCurrentDate = (date) => {
    return (0, exports.getDateDifference)(new Date(), date);
};
exports.getDateDifferenceFromCurrentDate = getDateDifferenceFromCurrentDate;
const sendOTPToPhoneNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let OTP = yield (0, exports.generateOTP)(phoneNumber);
    let otpToken = (0, exports.generateOTPtoken)(OTP);
    yield OTP_Model_1.default.findOneAndUpdate({ phoneNumber: phoneNumber }, {
        $set: { phoneNumber: phoneNumber, otp: otpToken },
    }, { upsert: true });
    exports.digiMilesSMS.sendOTPToPhoneNumber(phoneNumber, OTP);
});
exports.sendOTPToPhoneNumber = sendOTPToPhoneNumber;
const verifyPhoneNumber = (id, idOf) => __awaiter(void 0, void 0, void 0, function* () {
    let userModel = null;
    switch (idOf) {
        case "doctor": {
            userModel = Doctors_Model_1.default;
            break;
        }
        case "patient": {
            userModel = Patient_Model_1.default;
            break;
        }
        case "hospital": {
            userModel = Hospital_Model_1.default;
            break;
        }
    }
    yield (userModel === null || userModel === void 0 ? void 0 : userModel.findOneAndUpdate({ _id: id }, { $set: { phoneNumberVerified: true, lastTimePhoneNumberVerified: new Date() } }));
    return;
});
exports.verifyPhoneNumber = verifyPhoneNumber;
const formatTimings = (time) => {
    if (typeof time === "string") {
        return time;
    }
    if (time < 10) {
        return `0:${time}`;
    }
    return time.toString();
};
exports.formatTimings = formatTimings;
