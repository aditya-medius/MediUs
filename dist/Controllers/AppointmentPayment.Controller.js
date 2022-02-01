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
exports.verifyPayment = exports.generateOrderId = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const response_1 = require("../Services/response");
const AppointmentPayment_Model_1 = __importDefault(require("../Models/AppointmentPayment.Model"));
const crypto_1 = __importDefault(require("crypto"));
const orderController = __importStar(require("../Controllers/Order.Controller"));
const generateOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let instance = new razorpay_1.default({
            key_id: process.env.RAZOR_PAY_TEST_ID,
            key_secret: process.env.RAZOR_PAY_TEST_SECRET,
        });
        // const receiptNumber = Math.floor(
        //   100000 + Math.random() * 900000
        // ).toString();
        // var options = {
        //   amount: body.amount, // amount in the smallest currency unit
        //   currency: body.currency,
        //   receipt: `order_rcptid_${receiptNumber}`,
        // };
        const { orderId, options, receiptNumber } = yield orderController.createOrderId(body);
        instance.orders.create(options, function (err, order) {
            // console.log(order);
            if (err) {
                return (0, response_1.errorResponse)(err, res);
            }
            return (0, response_1.successResponse)({
                orderId: order,
                orderReceipt: `order_rcptid_${receiptNumber}`,
                _id: orderId._id,
            }, "Order id generated", res);
        });
    }
    catch (e) {
        return (0, response_1.errorResponse)(e, res);
    }
});
exports.generateOrderId = generateOrderId;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body.orderId + "|" + req.body.paymentId;
        var expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZOR_PAY_TEST_SECRET)
            .update(body.toString())
            .digest("hex");
        var response = { signatureIsValid: "false" };
        if (expectedSignature === req.body.paymentSignature) {
            response = { signatureIsValid: "true" };
            const paymentObj = yield new AppointmentPayment_Model_1.default(req.body);
            response.paymentDetails = paymentObj;
            return (0, response_1.successResponse)(response, "Signature is valid", res);
        }
        let error = new Error("Signature is invalid");
        error.name = "INvalid signature";
        return (0, response_1.errorResponse)(error, res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.verifyPayment = verifyPayment;
