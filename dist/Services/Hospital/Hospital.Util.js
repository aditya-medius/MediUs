"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatHospital = exports.formatHospitals = void 0;
const formatHospitals = (hospitals) => {
    const hospital = hospitals.map((hospital) => (0, exports.formatHospital)(hospital));
    return hospital;
};
exports.formatHospitals = formatHospitals;
const formatHospital = (hospital) => {
    return {
        id: hospital === null || hospital === void 0 ? void 0 : hospital.id,
        name: hospital === null || hospital === void 0 ? void 0 : hospital.name,
        lastLogin: hospital === null || hospital === void 0 ? void 0 : hospital.lastLogin,
        doctors: hospital === null || hospital === void 0 ? void 0 : hospital.doctors,
        status: hospital === null || hospital === void 0 ? void 0 : hospital.status,
        verified: hospital === null || hospital === void 0 ? void 0 : hospital.verified,
        contactNumber: hospital === null || hospital === void 0 ? void 0 : hospital.contactNumber,
        type: hospital === null || hospital === void 0 ? void 0 : hospital.type,
    };
};
exports.formatHospital = formatHospital;
