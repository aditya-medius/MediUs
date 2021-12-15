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
const hospitalSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: schemaNames_1.address
    },
    doctors: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: schemaNames_1.doctor
        }
    ],
    specialisedIn: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: schemaNames_1.specialization
        }
    ],
    anemity: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: schemaNames_1.anemity
        }],
    treatmentType: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: schemaNames_1.treatmentType
        }
    ],
    type: {
        type: String,
        required: true,
        enum: {
            values: ["Private", "Government"],
            message: "value not supported"
        }
    },
    payment: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: schemaNames_1.payment
        }],
    deleted: {
        type: Boolean,
        default: false
    },
    openingHour: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        // required: true,
        ref: schemaNames_1.openingHour
    },
    contactNumber: {
        type: String,
        required: true,
    },
    numberOfBed: {
        type: Number,
        required: true,
    },
    // location:{
    //     "type":"Point",
    //     "coordinates":['lat','lng']
    //   }
});
hospitalSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const hospitalExist = yield hospitalModel.findOne({
            $and: [
                {
                    $or: [
                        { contactNumber: this.contactNumber },
                    ],
                },
                { deleted: false },
            ],
        });
        if (/^[0]?[789]\d{9}$/.test(this.contactNumber)) {
            if (!hospitalExist) {
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
        let updateQuery = this.getUpdate();
        updateQuery = updateQuery["$set"];
        if ("contactNumber" in updateQuery) {
            const query = this.getQuery();
            const hospitalExist = yield this.model.findOne({
                _id: { $ne: query._id },
                $or: [
                    { contactNumber: updateQuery.contactNumber },
                ],
            });
            if (hospitalExist) {
                throw new Error("Hospital alredy exist. Select a different contact number");
            }
            else {
                return next();
            }
        }
        return next();
    });
});
const hospitalModel = (0, mongoose_1.model)(schemaNames_1.hospital, hospitalSchema);
exports.default = hospitalModel;
