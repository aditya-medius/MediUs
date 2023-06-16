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
exports.createAddress = exports.checkIfAddressBelongToTheHospital = exports.updateAddress = void 0;
const Address_Model_1 = __importDefault(require("../../Models/Address.Model"));
const Hospital_Model_1 = __importDefault(require("../../Models/Hospital.Model"));
const updateAddress = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { hospitalId, addressId, address } = body;
        let exist = yield (0, exports.checkIfAddressBelongToTheHospital)(hospitalId, addressId);
        if (exist) {
            let updatedAddress = yield Address_Model_1.default.findOneAndUpdate({ _id: addressId }, { $set: Object.assign({}, address) }, { new: true });
            return Promise.resolve(updatedAddress);
        }
        else {
            return Promise.reject(new Error("This is not your address"));
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.updateAddress = updateAddress;
const checkIfAddressBelongToTheHospital = (hospitalId, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let exist = yield Hospital_Model_1.default.findOne({
            _id: hospitalId,
            address: addressId,
        });
        if (exist) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.checkIfAddressBelongToTheHospital = checkIfAddressBelongToTheHospital;
const createAddress = (addressInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let addressData = yield new Address_Model_1.default(addressInfo).save();
        return Promise.resolve(addressData);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createAddress = createAddress;
