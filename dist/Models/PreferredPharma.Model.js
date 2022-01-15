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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaNames_1 = require("../Services/schemaNames");
const preferredPharmaSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: schemaNames_1.address
    },
    contact: {
        type: Number,
        required: true
    },
    doctor: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: schemaNames_1.doctor
    },
    deleted: {
        type: Boolean,
        default: false
    }
});
preferredPharmaSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const pharmaExist = yield preferredPharmaModel.findOne({
            $and: [{ deletd: false }, { contact: this.contact }]
        });
        if (/^[0]?[789]\d{9}$/.test(this.contact)) {
            if (!pharmaExist)
                return next();
            else {
                throw new Error("Pharmacy Already Exist");
            }
        }
        else {
            throw new Error("Invalid phone number");
        }
    });
});
const preferredPharmaModel = (0, mongoose_1.model)(schemaNames_1.preferredPharma, preferredPharmaSchema);
exports.default = preferredPharmaModel;
