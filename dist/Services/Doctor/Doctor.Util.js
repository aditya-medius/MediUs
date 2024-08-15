"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDoctor = exports.formatDoctors = void 0;
const formatDoctors = (doctors) => {
    const doctor = doctors.map((doctor) => (0, exports.formatDoctor)(doctor));
    return doctor;
};
exports.formatDoctors = formatDoctors;
const formatDoctor = (doctor) => {
    // console.log("Dsdssdsd", doctor)
    return {
        id: doctor === null || doctor === void 0 ? void 0 : doctor.id,
        name: `${doctor === null || doctor === void 0 ? void 0 : doctor.firstName} ${doctor.lastName}`,
        hospitals: doctor === null || doctor === void 0 ? void 0 : doctor.hospitalDetails,
        image: doctor === null || doctor === void 0 ? void 0 : doctor.image,
        verified: doctor === null || doctor === void 0 ? void 0 : doctor.verified,
        gender: doctor === null || doctor === void 0 ? void 0 : doctor.gender,
        DOB: doctor === null || doctor === void 0 ? void 0 : doctor.DOB,
        email: doctor === null || doctor === void 0 ? void 0 : doctor.email,
        deleted: doctor === null || doctor === void 0 ? void 0 : doctor.deleted,
        totalExperience: doctor === null || doctor === void 0 ? void 0 : doctor.totalExperience,
        overallExperience: doctor === null || doctor === void 0 ? void 0 : doctor.overallExperience,
        phoneNumberVerified: doctor === null || doctor === void 0 ? void 0 : doctor.phoneNumberVerified,
        lastTimePhoneNumberVerified: doctor === null || doctor === void 0 ? void 0 : doctor.lastTimePhoneNumberVerified
    };
};
exports.formatDoctor = formatDoctor;
