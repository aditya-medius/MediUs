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
exports.cronFunctions = exports.checkHospitalsLastLogin = exports.deleteHospital = exports.deletePaitent = exports.deleteDoctorSchedule = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Doctors_Model_1 = __importDefault(require("../Models/Doctors.Model"));
const moment_1 = __importDefault(require("moment"));
const Patient_Model_1 = __importDefault(require("../Models/Patient.Model"));
const Hospital_Model_1 = __importDefault(require("../Models/Hospital.Model"));
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
const checkHospitalsLastLogin = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("*/10 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        // console.log("SDdsddsdsdsd")
        const hospitals = yield Hospital_Model_1.default.find();
        hospitals;
    }));
});
exports.checkHospitalsLastLogin = checkHospitalsLastLogin;
exports.cronFunctions = [
    exports.checkHospitalsLastLogin
];
// export const cronFunctions = [
//   deleteDoctorSchedule,
//   deleteHospital,
//   deletePaitent,
// ];
