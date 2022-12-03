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
const orderController = __importStar(require("./Order.Controller"));
const crypto_1 = __importDefault(require("crypto"));
const CreditAmount_Model_1 = __importDefault(require("../Models/CreditAmount.Model"));
const Patient_Service_1 = require("../Services/Patient/Patient.Service");
const generateOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let instance = new razorpay_1.default({
            key_id: process.env.RAZOR_PAY_TEST_ID,
            key_secret: process.env.RAZOR_PAY_TEST_SECRET,
        });
        const { appointmentOrderId, options, receiptNumber } = yield orderController.generateOrderId(body);
        instance.orders.create(options, function (err, order) {
            if (err) {
                return (0, response_1.errorResponse)(err, res);
            }
            return (0, response_1.successResponse)({
                appointmentOrderId,
                orderId: order.id,
                orderReceipt: `order_rcptid_${receiptNumber}`,
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
        let b = req.body;
        var expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZOR_PAY_TEST_SECRET)
            .update(body.toString())
            .digest("hex");
        var response = { signatureIsValid: "false" };
        if (expectedSignature === req.body.paymentSignature) {
            response = { signatureIsValid: "true" };
            let isHospital = req.currentHospital ? true : false;
            const appointmentBook = yield (0, Patient_Service_1.BookAppointment)(b.appointment, isHospital);
            const { paymentId, orderId, paymentSignature, orderReceipt } = b;
            const paymentObj = yield new AppointmentPayment_Model_1.default({
                paymentId,
                orderId: req.body.appointmentOrderId,
                paymentSignature,
                orderReceipt,
                appointmentId: appointmentBook._id,
            }).save();
            yield new CreditAmount_Model_1.default({
                orderId: req.body.appointmentOrderId,
                appointmentDetails: appointmentBook._id,
            }).save();
            response.paymentDetails = paymentObj;
            return (0, response_1.successResponse)(response, "Signature is valid", res);
        }
        // let body = req.body;
        // const appointmentBook = await BookAppointment(body.appointment);
        // const { paymentId, orderId, paymentSignature, orderReceipt } = body;
        // const paymentObj = await new appointmentPayment({
        //   paymentId,
        //   orderId,
        //   paymentSignature,
        //   orderReceipt,
        //   appointmentId: appointmentBook._id,
        // }).save();
        // await new creditAmountModel({
        //   orderId: req.body.orderId,
        //   appointmentDetails: appointmentBook._id,
        // }).save();
        // return successResponse(paymentObj, "Signature is valid", res);
        let error = new Error("Signature is invalid");
        error.name = "INvalid signature";
        return (0, response_1.errorResponse)(error, res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.verifyPayment = verifyPayment;
