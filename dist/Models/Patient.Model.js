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
const mongoose_1 = require("mongoose");
const schemaOptions_1 = __importDefault(require("../Services/schemaOptions"));
const schemaNames_1 = require("../Services/schemaNames");
const patientSchema = new mongoose_1.Schema(Object.assign({}, schemaOptions_1.default));
patientSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileExist = yield patientModel.findOne({
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
        if (/^[0]?[6789]\d{9}$/.test(this.phoneNumber)) {
            if (!profileExist) {
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
        if ("phoneNumber" in updateQuery ||
            "email" in updateQuery) {
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
