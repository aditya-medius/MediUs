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
exports.getDoctorToken = exports.getPendingAmount = exports.getWithdrawanAmount = exports.getAvailableAmount = exports.getTotalEarnings = exports.getUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CreditAmount_Model_1 = __importDefault(require("../../Models/CreditAmount.Model"));
const Withdrawal_Model_1 = __importDefault(require("../../Models/Withdrawal.Model"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return req.currentDoctor ? req.currentDoctor : req.currentHospital;
});
exports.getUser = getUser;
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
const getAvailableAmount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Promise_TotalEarning = (0, exports.getTotalEarnings)(id);
        const Promise_PendingAmount = (0, exports.getPendingAmount)(id);
        let [totalEarning, pendingAmount] = yield Promise.all([
            Promise_TotalEarning,
            Promise_PendingAmount,
        ]);
        totalEarning = totalEarning[0] ? totalEarning[0].totalEarnings : null;
        pendingAmount = pendingAmount[0] ? pendingAmount[0].pendingAmount : null;
        return Promise.resolve();
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getAvailableAmount = getAvailableAmount;
const getWithdrawanAmount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Withdrawal_Model_1.default.aggregate([
            {
                $match: {
                    withdrawnBy: new mongoose_1.default.Types.ObjectId(id),
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
        return Promise.resolve(data);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getWithdrawanAmount = getWithdrawanAmount;
const getPendingAmount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        return Promise.resolve(totalEarning - withdrawnAmount);
    }
    catch (error) {
        throw error;
    }
});
exports.getPendingAmount = getPendingAmount;
const getDoctorToken = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwt.sign(body, process.env.SECRET_DOCTOR_KEY);
    return token;
});
exports.getDoctorToken = getDoctorToken;
