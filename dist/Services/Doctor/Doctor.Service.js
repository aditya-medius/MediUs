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
exports.getPendingAmount = exports.getWithdrawanAmount = exports.getAvailableAmount = exports.getTotalEarnings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CreditAmount_Model_1 = __importDefault(require("../../Models/CreditAmount.Model"));
const Withdrawal_Model_1 = __importDefault(require("../../Models/Withdrawal.Model"));
const getTotalEarnings = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const totalEarnings = yield CreditAmount_Model_1.default.aggregate([
        {
            $lookup: {
                from: "orders",
                localField: "orderId",
                foreignField: "_id",
                as: "orderId",
            },
        },
        {
            $unwind: {
                path: "$orderId",
            },
        },
        {
            $lookup: {
                from: "appointments",
                localField: "orderId.appointmentDetails",
                foreignField: "_id",
                as: "orderId.appointmentDetails",
            },
        },
        {
            $unwind: {
                path: "$orderId.appointmentDetails",
            },
        },
        {
            $match: {
                "orderId.appointmentDetails.doctors": new mongoose_1.default.Types.ObjectId(id),
            },
        },
        {
            $group: {
                _id: "$orderId.appointmentDetails.doctors",
                totalEarnings: {
                    $sum: "$orderId.amount",
                },
            },
        },
    ]);
    return totalEarnings;
});
exports.getTotalEarnings = getTotalEarnings;
const getAvailableAmount = (req) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getAvailableAmount = getAvailableAmount;
const getWithdrawanAmount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Withdrawal_Model_1.default.aggregate([
        {
            $match: {
                user: new mongoose_1.default.Types.ObjectId(id),
            },
        },
        {
            $group: {
                _id: "$user",
                withdrawnAmount: {
                    $sum: "$withdrawalAmount",
                },
            },
        },
    ]);
    return data;
});
exports.getWithdrawanAmount = getWithdrawanAmount;
const getPendingAmount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("id:", id);
        const Promise_TotalEarning = (0, exports.getTotalEarnings)(id);
        const Promise_WithdrawnAmount = (0, exports.getWithdrawanAmount)(id);
        let [totalEarning, withdrawnAmount] = yield Promise.all([
            Promise_TotalEarning,
            Promise_WithdrawnAmount,
        ]);
        totalEarning = totalEarning[0] ? totalEarning[0].totalEarnings : null;
        withdrawnAmount = withdrawnAmount[0]
            ? withdrawnAmount[0].withdrawnAmount
            : null;
        if (!totalEarning) {
            return Promise.reject("You have not earned anything");
        }
        else if (!withdrawnAmount) {
            return Promise.resolve(totalEarning);
        }
        console.log("DSdsds:", withdrawnAmount, totalEarning);
        return Promise.resolve(totalEarning - withdrawnAmount);
    }
    catch (error) {
        throw error;
    }
});
exports.getPendingAmount = getPendingAmount;
