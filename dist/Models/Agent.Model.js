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
const agentSchema = new mongoose_1.Schema({
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
        length: 10,
    },
    alternateNumber: {
        type: String,
        length: 10,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    photoIdentityNumber: {
        type: String,
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
    image: {
        type: String,
        default: "static/user/default.png",
        // ref: media,
    },
});
agentSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const agentProfile = yield agentModel.findOne({
            phoneNumber: this.phoneNumber,
        });
        if (agentProfile) {
            throw new Error("Agent profile already exist");
        }
        next();
    });
});
const agentModel = (0, mongoose_1.model)(schemaNames_1.agent, agentSchema);
exports.default = agentModel;
