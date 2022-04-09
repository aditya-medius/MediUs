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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaOptions_1 = __importDefault(require("../Services/schemaOptions"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const schemaNames_1 = require("../Services/schemaNames");
const Hospital_Model_1 = __importDefault(require("./Hospital.Model"));
const Patient_Model_1 = __importDefault(require("./Patient.Model"));
const doctorSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, schemaOptions_1.default), { hospitalDetails: [
        {
            type: {
                hospital: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    required: [true, "Hospital is required"],
                    ref: schemaNames_1.hospital,
                },
                workingHours: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    // required: [true, "working hours is required"],
                    ref: schemaNames_1.workingHour,
                },
                consultationFee: {
                    min: {
                        required: [true, "Minimum consultation fee is required"],
                        type: Number,
                    },
                    max: {
                        required: [true, "Maximum consultation fee is required"],
                        type: Number,
                    },
                },
            },
        },
    ], registration: {
        type: {
            registrationNumber: {
                type: String,
            },
            registrationCouncil: {
                type: String,
            },
            registrationDate: {
                type: Date,
            },
        },
        // required: true,
    }, specialization: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: schemaNames_1.specialization,
        },
    ], KYCDetails: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.kycDetails,
        // required: [true, "KYC details are required"],
    }, qualification: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: schemaNames_1.qualification,
        },
    ], liked: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.like,
    }, treatmentType: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.treatmentType,
    }, overallExperience: {
        type: mongoose_1.default.Schema.Types.Mixed,
        // required: true,
    }, image: {
        type: String,
        default: "static/user/default.png",
        // ref: media,
    }, 
    // // Admin is field edit karega aur koi nhi
    verified: {
        type: Boolean,
        default: false,
    } }), {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
doctorSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileExist = yield doctorModel.findOne({
            $and: [
                {
                    $or: [
                        {
                            email: this.email,
                        },
                        { phoneNumber: this.phoneNumber },
                    ],
                },
                { deleted: false },
            ],
            queryType: "save",
        });
        const hospitalExist = yield Hospital_Model_1.default.findOne({
            $and: [
                {
                    $or: [
                        {
                            email: this.email,
                        },
                        { contactNumber: this.phoneNumber },
                    ],
                },
                { deleted: false },
            ],
        });
        const patientExist = yield Patient_Model_1.default.findOne({
            $and: [
                {
                    $or: [
                        {
                            email: this.email,
                        },
                        { phoneNumber: this.phoneNumber },
                    ],
                },
                { deleted: false },
            ],
        });
        if (/^[0]?[789]\d{9}$/.test(this.phoneNumber)) {
            if (!(profileExist || hospitalExist || patientExist) ||
                this.phoneNumber == "9999999999") {
                return next();
            }
            else if (!profileExist.verified) {
                throw new Error("Your profile is under verification process");
            }
            else {
                throw new Error("Profile alredy exist. Select a different phone number and email");
            }
        }
        else {
            throw new Error("Invalid phone number");
        }
    });
});
["find", "findOne"].forEach((e) => {
    doctorSchema.pre(e, function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Yeh Crob Job k liye hai
            // queryType ki field pass kara dena cron job me
            // doctor pe query lagate samay
            if (Object.keys(this.getQuery()).includes("queryType")) {
                const _a = this.getQuery(), { queryType } = _a, rest = __rest(_a, ["queryType"]);
                this.where({
                    rest,
                    deleted: false,
                });
            }
            else {
                // Agar admin se doctor ki koi record get kr rhe ho to
                // adminSearch field daal dena.
                // Usse unverified records bhi aa jayenge
                if (Object.keys(this.getQuery()).includes("adminSearch") ||
                    Object.keys(this.getQuery()).includes("login")) {
                    const _b = this.getQuery(), { adminSearch } = _b, rest = __rest(_b, ["adminSearch"]);
                    this.where({ rest });
                }
                else {
                    this.where(Object.assign(Object.assign({}, this.getQuery()), { deleted: false }));
                }
                this.populate("KYCDetails");
                next();
            }
        });
    });
});
doctorSchema.post("findOne", function (result) {
    return __awaiter(this, void 0, void 0, function* () {
        if (result && result.overallExperience) {
            const exp = (0, moment_1.default)(new Date(result.overallExperience));
            const currentDate = (0, moment_1.default)(new Date());
            let overExp = currentDate.diff(exp, "years", true);
            if (overExp < 1) {
                overExp = `${currentDate.diff(exp, "months")} months`;
            }
            else {
                overExp = `${overExp} years`;
            }
            result.overallExperience = overExp;
        }
    });
});
doctorSchema.post("find", function (res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.forEach((result) => __awaiter(this, void 0, void 0, function* () {
            if (result && result.overallExperience) {
                const exp = (0, moment_1.default)(new Date(result.overallExperience));
                const currentDate = (0, moment_1.default)(new Date());
                let overExp = currentDate.diff(exp, "years", true);
                if (overExp < 1) {
                    overExp = `${currentDate.diff(exp, "months")} months`;
                }
                else {
                    overExp = `${overExp} years`;
                }
                result.overallExperience = overExp;
            }
        }));
    });
});
doctorSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let updateQuery = this.getUpdate();
        updateQuery = updateQuery["$set"];
        if (updateQuery &&
            ("phoneNumber" in updateQuery ||
                "email" in updateQuery ||
                "panCard" in updateQuery ||
                "adhaarCard" in updateQuery)) {
            const query = this.getQuery();
            const profileExist = yield this.model.findOne({
                _id: { $ne: query._id },
                $or: [
                    {
                        email: updateQuery.email,
                    },
                    { phoneNumber: updateQuery.phoneNumber },
                    { panCard: updateQuery.panCard },
                    { adhaarCard: updateQuery.panCard },
                ],
            });
            if (profileExist) {
                throw new Error("Profile alredy exist. Select a different phone number and email");
            }
            else {
                return next();
            }
        }
        return next();
    });
});
doctorSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let updateQuery = this.getUpdate();
        updateQuery = updateQuery["$addToSet"];
        if (updateQuery && "hospitalDetails" in updateQuery) {
            const currentDoc = yield this.model.findOne({ _id: this.getQuery()._id });
            const incomingHospitals = lodash_1.default.map(updateQuery.hospitalDetails, (e) => e.hospital.toString());
            const currentHospitals = lodash_1.default.map(currentDoc.hospitalDetails, (e) => e.hospital.toString());
            const combinedHospitals = [
                ...incomingHospitals,
                ...currentHospitals,
            ];
            if (combinedHospitals.length != new Set(combinedHospitals).size) {
                throw new Error("Cannot add same hospital twice");
            }
        }
        next();
    });
});
// Hospital details validation
// doctorSchema.path("hospitalDetails").validate(function (hospital: any) {
//   if (hospital.length < 1) {
//     return false;
//   }
//   return true;
// }, "Hospital details are required");
doctorSchema.path("hospitalDetails").validate(function (hospital) {
    // if (hospital.lenght) {
    // }let element
    let element;
    if (hospital.length > 1) {
        for (let index = 0; index < hospital.length; index++) {
            for (let i = index + 1; i < hospital.length; i++) {
                if (hospital[i]) {
                    if (hospital[index].hospital.toString() ==
                        hospital[i].hospital.toString()) {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
        }
    }
    return true;
}, "Cannot enter same hospital twice");
// Specialization validation
doctorSchema.path("specialization").validate(function (specialization) {
    if (specialization.length < 1) {
        return false;
    }
    return true;
}, "specialization details are required");
// Qualification Validation
// doctorSchema.path("qualification").validate(function (qualification: any) {
//   if (qualification.length < 1) {
//     return false;
//   }
//   return true;
// }, "qualification details are required");
["remove", "findOneAndDelete"].forEach((e) => {
    doctorSchema.pre(e, function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = this;
            doctor.model(schemaNames_1.workingHour).remove({ doctorDetails: doctor._id }, next);
        });
    });
});
const doctorModel = (0, mongoose_1.model)(schemaNames_1.doctor, doctorSchema);
exports.default = doctorModel;
