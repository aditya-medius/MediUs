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
exports.updatePharma = exports.delPharma = exports.getPharma = exports.addPharma = void 0;
const PreferredPharma_Model_1 = __importDefault(require("../Models/PreferredPharma.Model"));
const response_1 = require("../Services/response");
//add the pharma
const addPharma = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let pharmaObj = yield new PreferredPharma_Model_1.default(body).save();
        if (pharmaObj) {
            return (0, response_1.successResponse)(pharmaObj, "Successfully added the Pharma", res);
        }
        else {
            let error = new Error("Can't add pharmacy");
            return (0, response_1.errorResponse)(error, res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.addPharma = addPharma;
//get all the pharma
const getPharma = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pharmaList = yield PreferredPharma_Model_1.default
            .find({ deleted: false })
            .populate([
            {
                path: "address",
                populate: {
                    path: "city state locality country",
                },
            },
        ]);
        if (pharmaList.length > 0)
            return (0, response_1.successResponse)(pharmaList, "Successfully Fetched Pharmacy", res);
        else {
            let error = new Error("No Pharmacy Found!");
            return (0, response_1.errorResponse)(error, res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.getPharma = getPharma;
//delete the pharma
const delPharma = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pharmaList = yield PreferredPharma_Model_1.default.findOneAndUpdate({ deleted: false, _id: req.params.id }, { $set: { deleted: true } });
        if (pharmaList)
            return (0, response_1.successResponse)({}, "Pharma Deleted Successfully", res);
        else {
            let error = new Error("Pharmacy doesnot exist");
            return (0, response_1.errorResponse)(error, res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.delPharma = delPharma;
//update the pharma
const updatePharma = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const pharmaObj = yield PreferredPharma_Model_1.default.findOneAndUpdate({ deleted: false, _id: req.params.id }, { $set: { name: body.name, updated: true } });
        if (pharmaObj)
            return (0, response_1.successResponse)({}, "Successfully updated the Pharmacy", res);
        else {
            let error = new Error("No Phramacy Found!");
            error.name = "Invalid Pharmacy Id";
            return (0, response_1.errorResponse)(error, res);
        }
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.updatePharma = updatePharma;
