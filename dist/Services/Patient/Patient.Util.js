"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPatient = exports.formatPatients = void 0;
const formatPatients = (doctors) => {
    const patient = doctors.map((patient) => (0, exports.formatPatient)(patient));
    return patient;
};
exports.formatPatients = formatPatients;
const formatPatient = (patient) => {
    return {
        id: patient === null || patient === void 0 ? void 0 : patient.id,
        name: `${patient === null || patient === void 0 ? void 0 : patient.firstName} ${patient.lastName}`,
        image: patient === null || patient === void 0 ? void 0 : patient.image,
        verified: patient === null || patient === void 0 ? void 0 : patient.verified,
        gender: patient === null || patient === void 0 ? void 0 : patient.gender,
        DOB: patient === null || patient === void 0 ? void 0 : patient.DOB,
        email: patient === null || patient === void 0 ? void 0 : patient.email,
        deleted: patient === null || patient === void 0 ? void 0 : patient.deleted,
        overallExperience: patient === null || patient === void 0 ? void 0 : patient.overallExperience,
        phoneNumberVerified: patient === null || patient === void 0 ? void 0 : patient.phoneNumberVerified,
        lastTimePhoneNumberVerified: patient === null || patient === void 0 ? void 0 : patient.lastTimePhoneNumberVerified
    };
};
exports.formatPatient = formatPatient;
