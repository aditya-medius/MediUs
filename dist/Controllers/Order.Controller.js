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
exports.createOrderId = void 0;
const Order_Model_1 = __importDefault(require("../Models/Order.Model"));
const createOrderId = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiptNumber = Math.floor(100000 + Math.random() * 900000).toString();
        var options = {
            amount: body.amount,
            currency: body.currency,
            receipt: `order_rcptid_${receiptNumber}`,
        };
        const orderId = yield new Order_Model_1.default(options).save();
        return { orderId, options, receiptNumber };
    }
    catch (error) {
        return error;
    }
});
exports.createOrderId = createOrderId;
