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
exports.createSuvedhaProfile = void 0;
const Suvedha_Model_1 = __importDefault(require("../../Models/Suvedha.Model"));
const Address_Service_1 = require("../Address/Address.Service");
const createSuvedhaProfile = (suvedhaInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { state, city, locality, addressLine_1, pincode } = suvedhaInfo, rest = __rest(suvedhaInfo, ["state", "city", "locality", "addressLine_1", "pincode"]);
        if (state || city || locality || addressLine_1 || pincode) {
            let addressId = (yield (0, Address_Service_1.createAddress)({
                state,
                city,
                locality,
                addressLine_1,
                pincode,
            }))._id;
            rest["address"] = addressId;
        }
        // let profile = await new suvedhaModel(rest).save();
        let profile = yield Suvedha_Model_1.default.findOneAndUpdate({ _id: suvedhaInfo === null || suvedhaInfo === void 0 ? void 0 : suvedhaInfo._id }, { $set: rest }, { new: true });
        return Promise.resolve(profile);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createSuvedhaProfile = createSuvedhaProfile;
