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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const adminSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
    },
    password: {
        type: String,
        required: true,
    },
});
adminSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileExist = yield adminModel.findOne({
            phoneNumber: this.phoneNumber,
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
const adminModel = (0, mongoose_1.model)(schemaNames_1.admin, adminSchema);
exports.default = adminModel;
