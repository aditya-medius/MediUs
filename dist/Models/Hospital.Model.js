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
const mongoose_1 = __importStar(require("mongoose"));
const schemaNames_1 = require("../Services/schemaNames");
const Doctors_Model_1 = __importDefault(require("./Doctors.Model"));
const Patient_Model_1 = __importDefault(require("./Patient.Model"));
const Helpers_1 = require("../Services/Helpers");
const hospitalSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.address,
    },
    doctors: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            // required: true,
            ref: schemaNames_1.doctor,
        },
    ],
    specialisedIn: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            // required: true,
            ref: schemaNames_1.specialization,
        },
    ],
    anemity: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            // required: true,
            ref: schemaNames_1.anemity,
        },
    ],
    services: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: schemaNames_1.services,
        },
    ],
    treatmentType: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            // required: true,
            ref: schemaNames_1.treatmentType,
        },
    ],
    type: {
        type: String,
        required: true,
        enum: {
            values: ["Private", "Government"],
            message: "value not supported",
        },
    },
    payment: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            // required: true,
            ref: schemaNames_1.payment,
        },
    ],
    deleted: {
        type: Boolean,
        default: false,
    },
    openingHour: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        // required: true,
        ref: schemaNames_1.workingHour,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    numberOfBed: {
        type: Number,
        // required: true,
    },
    ICUBeds: {
        type: Number,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true
        },
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    // Admin is field edit karega aur koi nhi
    verified: {
        type: Boolean,
        default: true,
    },
    modeOfAppointments: [
        {
            type: String,
            enum: ["Offline", "Online"],
        },
    ],
    registrationDetails: {
        registrationNumber: String,
        registrationCouncil: String,
        registrationDate: Date,
    },
    paymentDetails: {
        accountHolderName: String,
        accountNumber: String,
        bankName: String,
        IFSC: String,
        PAN: String,
    },
    firebaseToken: {
        type: String,
        // required: true,
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    holiday: [
        {
            type: Date
        }
    ],
    status: {
        type: String,
        enum: [Helpers_1.UserStatus.ACTIVE, Helpers_1.UserStatus.INACTIVE, Helpers_1.UserStatus.ONHOLD],
        default: Helpers_1.UserStatus.ACTIVE
    },
    lastLogin: {
        type: Date
    },
    phoneNumberVerified: {
        type: Boolean,
        default: true
    },
    lastTimePhoneNumberVerified: {
        type: Date
    },
    profileImage: {
        type: String,
        default: "static/user/default.png",
        // ref: media,
    },
});
hospitalSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const hospitalExist = yield hospitalModel.findOne({
            $and: [
                {
                    $or: [{ contactNumber: this.contactNumber }],
                },
                { deleted: false },
            ],
        });
        const patientProfile = yield Patient_Model_1.default.findOne({
            $and: [
                {
                    $or: [{ phoneNumber: this.contactNumber }],
                },
                { deleted: false },
            ],
        });
        const doctorProfile = yield Doctors_Model_1.default.findOne({
            $and: [
                {
                    $or: [{ phoneNumber: this.contactNumber }],
                },
                { deleted: false },
            ],
        });
        if (/^[0]?[6789]\d{9}$/.test(this.contactNumber)) {
            if (!(hospitalExist || patientProfile || doctorProfile) ||
                this.contactNumber == "9999999999") {
                return next();
            }
            else {
                throw new Error("Hospital already exist. Select a different phone number");
            }
        }
        else {
            throw new Error("Invalid phone number");
        }
    });
});
hospitalSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let UpdateQuery = this.getUpdate();
        // console.log(UpdateQuery);
        if ("contactNumber" in UpdateQuery) {
            UpdateQuery = UpdateQuery["$set"];
            const query = this.getQuery();
            if (!UpdateQuery.phoneNumberUpdate) {
                const hospitalExist = yield this.model.findOne({
                    _id: { $ne: query._id },
                    $or: [{ contactNumber: UpdateQuery.contactNumber }],
                });
                if (hospitalExist) {
                    throw new Error("Hospital alredy exist. Select a different contact number");
                }
                else {
                    return next();
                }
            }
            return next();
        }
        else {
            return next();
        }
    });
});
//check for number of bed
hospitalSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let UpdateQuery = this.getUpdate();
        if ("numberOfBed" in UpdateQuery) {
            UpdateQuery = UpdateQuery["$set"];
            if (UpdateQuery.numberOfBed <= 0)
                throw new Error("Number of beds can't equal or less than zero");
            else
                return next();
        }
        else {
            return next();
        }
    });
});
const hospitalModel = (0, mongoose_1.model)(schemaNames_1.hospital, hospitalSchema);
exports.default = hospitalModel;
