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
exports.cronFunctions = exports.markHospitalAsOnHoldIfItHasNotLoggedInInAWeek = exports.deleteHospital = exports.deletePaitent = exports.deleteDoctorSchedule = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const moment_1 = __importDefault(require("moment"));
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
const Hospital_Service_1 = require("./Hospital/Hospital.Service");
const Helpers_1 = require("./Helpers");
const Hospital_Util_1 = require("./Hospital/Hospital.Util");
const Doctor_Util_1 = require("./Doctor/Doctor.Util");
const Doctor_Service_1 = require("./Doctor/Doctor.Service");
const Patient_Service_1 = require("./Patient/Patient.Service");
const Hospital_Service_2 = require("./Hospital/Hospital.Service");
const Patient_Util_1 = require("./Patient/Patient.Util");
const deleteDoctorSchedule = () => __awaiter(void 0, void 0, void 0, function* () {
    // Cron job har 10 min me chal rhi hai
    node_cron_1.default.schedule("0/10 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const deletedDoctors = yield Doctors_Model_1.default.find({
            deleted: true,
        });
        const todayDate = (0, moment_1.default)(new Date());
        deletedDoctors.forEach((e) => __awaiter(void 0, void 0, void 0, function* () {
            let deletedDate = (0, moment_1.default)(new Date(e.deleteDate));
            let diff = Math.abs(todayDate.diff(deletedDate, "days"));
            if (diff > 15) {
                yield Doctors_Model_1.default.findOneAndDelete({ _id: e._id });
                console.log("Doctor deleted successfully");
            }
            else {
                console.log("Do Nothing");
            }
        }));
    }));
});
exports.deleteDoctorSchedule = deleteDoctorSchedule;
const deletePaitent = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("0/10 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const deletedPatient = yield Patient_Model_1.default.find({
            deleted: true,
        });
        const todayDate = (0, moment_1.default)(new Date());
        deletedPatient.forEach((e) => __awaiter(void 0, void 0, void 0, function* () {
            let deletedDate = (0, moment_1.default)(new Date(e.deleteDate));
            let diff = Math.abs(todayDate.diff(deletedDate, "days"));
            if (diff > 15) {
                yield Patient_Model_1.default.findOneAndDelete({ _id: e._id });
                console.log("Patient deleted successfully");
            }
            else {
                console.log("Do Nothing");
            }
        }));
    }));
});
exports.deletePaitent = deletePaitent;
const deleteHospital = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("0/10 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const deletedHospital = yield Hospital_Model_1.default.find({
            deleted: true,
        });
        const todayDate = (0, moment_1.default)(new Date());
        deletedHospital.forEach((e) => __awaiter(void 0, void 0, void 0, function* () {
            let deletedDate = (0, moment_1.default)(new Date(e.deleteDate));
            let diff = Math.abs(todayDate.diff(deletedDate, "days"));
            if (diff > 15) {
                yield Hospital_Model_1.default.findOneAndDelete({ _id: e._id });
                console.log("Hospital deleted successfully");
            }
            else {
                console.log("Do Nothing");
            }
        }));
    }));
});
exports.deleteHospital = deleteHospital;
const markHospitalAsOnHoldIfItHasNotLoggedInInAWeek = () => {
    const onHoldPeriod = process.env.ONHOLDJOBPERIOD;
    node_cron_1.default.schedule(onHoldPeriod, () => __awaiter(void 0, void 0, void 0, function* () {
        const hospialData = yield Hospital_Model_1.default.find({ status: { $nin: [Helpers_1.UserStatus.ONHOLD, Helpers_1.UserStatus.INACTIVE] } });
        if (hospialData.length > 0) {
            const hospital = (0, Hospital_Util_1.formatHospitals)(hospialData);
            const hospitalsThatHaveNotLoggedInAWeek = (0, Hospital_Service_1.checkIfHospitalHasLoggedInThePastWeek)(hospital);
            (0, Hospital_Service_1.markHospitalsAccountAsOnHold)(hospitalsThatHaveNotLoggedInAWeek);
        }
    }));
};
exports.markHospitalAsOnHoldIfItHasNotLoggedInInAWeek = markHospitalAsOnHoldIfItHasNotLoggedInInAWeek;
const markHospitalAsInactiveIfItHasBeenOnHoldForAMonth = () => {
    const inActivePeriod = process.env.INACTIVEJOBPERIOD;
    node_cron_1.default.schedule(inActivePeriod, () => __awaiter(void 0, void 0, void 0, function* () {
        const hospialData = yield Hospital_Model_1.default.find({ status: { $ne: Helpers_1.UserStatus.INACTIVE } });
        if (hospialData.length > 0) {
            const hospital = (0, Hospital_Util_1.formatHospitals)(hospialData);
            const hospitalsThatHaveNotLoggedInAMonth = (0, Hospital_Service_1.checkIfHospitalHasLoggedInInThePastMonth)(hospital);
            (0, Hospital_Service_1.markHospitalsAccountAsInactive)(hospitalsThatHaveNotLoggedInAMonth);
        }
    }));
};
const markDoctorsPhoneNumberAsNotVerified = () => {
    const numberVerifyingPeriod = process.env.NUMBERVERIFYINGPERIOD;
    node_cron_1.default.schedule(numberVerifyingPeriod, () => __awaiter(void 0, void 0, void 0, function* () {
        const doctorData = yield Doctors_Model_1.default.find({ $or: [{ phoneNumberVerified: { $exists: false } }, { phoneNumberVerified: true }] });
        if (doctorData.length > 0) {
            const doctor = (0, Doctor_Util_1.formatDoctors)(doctorData);
            (0, Doctor_Service_1.markDoctorsPhoneNumberAsNotVerified)(doctor);
        }
    }));
};
const markPatientsPhoneNumberAsNotVerified = () => {
    const numberVerifyingPeriod = process.env.NUMBERVERIFYINGPERIOD;
    node_cron_1.default.schedule(numberVerifyingPeriod, () => __awaiter(void 0, void 0, void 0, function* () {
        const patientData = yield Patient_Model_1.default.find({ $or: [{ phoneNumberVerified: { $exists: false } }, { phoneNumberVerified: true }] });
        if (patientData.length > 0) {
            const patient = (0, Patient_Util_1.formatPatients)(patientData);
            (0, Patient_Service_1.markPatientsPhoneNumberAsNotVerified)(patient);
        }
    }));
};
const markHospitalNumberAsNotverified = () => {
    const numberVerifyingPeriod = process.env.NUMBERVERIFYINGPERIOD;
    node_cron_1.default.schedule(numberVerifyingPeriod, () => __awaiter(void 0, void 0, void 0, function* () {
        const hospitalData = yield Hospital_Model_1.default.find({ $or: [{ phoneNumberVerified: { $exists: false } }, { phoneNumberVerified: true }] });
        if (hospitalData.length > 0) {
            const hospital = (0, Hospital_Util_1.formatHospitals)(hospitalData);
            (0, Hospital_Service_2.markHospitalNumberAsNotverified)(hospital);
        }
    }));
};
const markHospitalAsOnHoldIfItHasNotVerifiedPhoneNumber = () => {
    const onHoldPeriod = process.env.ONHOLDNUMBERJOBPERIOD;
    node_cron_1.default.schedule(onHoldPeriod, () => __awaiter(void 0, void 0, void 0, function* () {
        const hospialData = yield Hospital_Model_1.default.find({ status: { $nin: [Helpers_1.UserStatus.ONHOLD, Helpers_1.UserStatus.INACTIVE] } });
        if (hospialData.length > 0) {
            const hospital = (0, Hospital_Util_1.formatHospitals)(hospialData);
            const hospitalsThatHaveNotLoggedInAWeek = (0, Hospital_Service_1.checkIfHospitalHasLoggedInThePastWeek)(hospital);
            (0, Hospital_Service_1.markHospitalsAccountAsOnHold)(hospitalsThatHaveNotLoggedInAWeek);
        }
    }));
};
const markHospitalAsInactiveIfItHasNotVerifiedPhoneNumber = () => {
    const inActivePeriod = process.env.INACTIVENUMBERJOBPERIOD;
    node_cron_1.default.schedule(inActivePeriod, () => __awaiter(void 0, void 0, void 0, function* () {
        const hospialData = yield Hospital_Model_1.default.find({ status: { $ne: Helpers_1.UserStatus.INACTIVE } });
        if (hospialData.length > 0) {
            const hospital = (0, Hospital_Util_1.formatHospitals)(hospialData);
            const hospitalsThatHaveNotLoggedInAMonth = (0, Hospital_Service_1.checkIfHospitalHasLoggedInInThePastMonth)(hospital);
            (0, Hospital_Service_1.markHospitalsAccountAsInactive)(hospitalsThatHaveNotLoggedInAMonth);
        }
    }));
};
exports.cronFunctions = [
    exports.markHospitalAsOnHoldIfItHasNotLoggedInInAWeek,
    markHospitalAsInactiveIfItHasBeenOnHoldForAMonth,
    markDoctorsPhoneNumberAsNotVerified,
    markPatientsPhoneNumberAsNotVerified,
    markHospitalNumberAsNotverified
];
// export const cronFunctions = [
//   deleteDoctorSchedule,
//   deleteHospital,
//   deletePaitent,
// ];
