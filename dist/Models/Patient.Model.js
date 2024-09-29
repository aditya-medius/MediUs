"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const schemaOptions_1 = __importDefault(require("../Services/schemaOptions"));
const schemaNames_1 = require("../Services/schemaNames");
const Hospital_Model_1 = __importDefault(require("./Hospital.Model"));
const Doctors_Model_1 = __importDefault(require("./Doctors.Model"));
const patientSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, schemaOptions_1.default), { location: {
        type: {
            type: String,
            enum: ["Point"],
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true
        },
    }, address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.address,
    }, firebaseToken: {
        type: String,
        // required: true,
    }, parentPatient: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.patient
    }, phoneNumberVerified: {
        type: Boolean,
        default: true
    }, lastTimePhoneNumberVerified: {
        type: Date
    } }));
patientSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileExist = yield patientModel.findOne({
            $and: [
                {
                    $or: [
                        // {
                        //   email: this.email,
                        // },
                        { phoneNumber: this.phoneNumber },
                    ],
                },
                { deleted: false },
            ],
        });
        const hospitalExist = yield Hospital_Model_1.default.findOne({
            $and: [
                {
                    $or: [
                        // {
                        //   email: this.email,
                        // },
                        { contactNumber: this.phoneNumber },
                    ],
                },
                { deleted: false },
            ],
        });
        const doctorExist = yield Doctors_Model_1.default.findOne({
            $and: [
                {
                    $or: [
                        // {
                        //   email: this.email,
                        // },
                        { phoneNumber: this.phoneNumber },
                    ],
                },
                { deleted: false },
            ],
        });
        if (/^[0]?[6789]\d{9}$/.test(this.phoneNumber)) {
            if (!(profileExist || hospitalExist || doctorExist) ||
                this.phoneNumber == "9999999999") {
                return next();
            }
            else {
                throw new Error("Profile alredy exist. Select a different Phone Number and Email");
            }
        }
        else {
            throw new Error("Invalid Phone Number");
        }
    });
});
patientSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let updateQuery = this.getUpdate();
        updateQuery = updateQuery["$set"];
        if ("phoneNumber" in updateQuery || "email" in updateQuery) {
            const query = this.getQuery();
            const profileExist = yield this.model.findOne({
                _id: { $ne: query._id },
                $or: [
                    {
                        email: updateQuery.email,
                    },
                    { phoneNumber: updateQuery.phoneNumber },
                ],
            });
            if (profileExist) {
                throw new Error("Profile alredy exist. Select a different Phone Number and Email");
            }
            else {
                return next();
            }
        }
        return next();
    });
});
const patientModel = (0, mongoose_1.model)(schemaNames_1.patient, patientSchema);
exports.default = patientModel;
