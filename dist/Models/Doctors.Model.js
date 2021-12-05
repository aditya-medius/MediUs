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
const schemaOptions_1 = __importDefault(require("../Services/schemaOptions"));
const schemaNames_1 = require("../Services/schemaNames");
const doctorSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, schemaOptions_1.default), { hospitalDetails: [
        {
            hospital: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true,
                ref: schemaNames_1.hospital,
            },
            workingHours: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true,
                ref: schemaNames_1.workingHour,
            },
            consultationFee: {
                min: {
                    required: true,
                    type: Number,
                },
                max: {
                    required: true,
                    type: Number,
                },
            },
        },
    ], registrationDate: {
        type: Date,
        required: true,
    }, specialization: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: schemaNames_1.speciality,
        },
    ], panCard: {
        type: String,
        required: true,
    }, adhaarCard: {
        type: String,
        required: true,
        minlength: 12,
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
    } }));
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
        });
        if (/^[0]?[789]\d{9}$/.test(this.phoneNumber)) {
            if (!profileExist) {
                return next();
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
doctorSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let updateQuery = this.getUpdate();
        updateQuery = updateQuery["$set"];
        if ("phoneNumber" in updateQuery ||
            "email" in updateQuery ||
            "panCard" in updateQuery ||
            "adhaarCard" in updateQuery) {
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
                throw new Error("Profile alredy exist. Select a different phone number and email");
            }
            else {
                return next();
            }
        }
        return next();
    });
});
// const mongooseEventList = ["find", "findOne"];
// mongooseEventList.forEach((event: any) => {
//   doctorSchema.pre(event, async function (next) {
//     this.select({
//       password: 0,
//       panCard: 0,
//       adhaarCard: 0,
//       verified: 0,
//       registrationDate: 0,
//       DOB: 0,
//     });
//     return next();
//   });
// });
const doctorModel = (0, mongoose_1.model)(schemaNames_1.doctor, doctorSchema);
exports.default = doctorModel;
