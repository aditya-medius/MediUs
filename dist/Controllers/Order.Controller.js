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
exports.generateOrderId = void 0;
const Order_Model_1 = __importDefault(require("../Models/Order.Model"));
const generateOrderId = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiptNumber = Math.floor(100000 + Math.random() * 900000).toString();
        var opt = {
            amount: body.amount,
            currency: body.currency,
            receipt: `order_rcptid_${receiptNumber}`,
            otherCharges: body.otherCharges,
            // appointmentDetails: body.appointment,
        };
        const appointmentOrderId = yield new Order_Model_1.default(opt).save();
        const options = __rest(opt, []);
        return { appointmentOrderId, options, receiptNumber };
    }
    catch (error) {
        return { error };
    }
});
exports.generateOrderId = generateOrderId;
