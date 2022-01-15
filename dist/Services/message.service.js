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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const twilio_1 = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendMessage = (body, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new twilio_1.Twilio(accountSid, authToken);
    return client.messages.create({
        body,
        messagingServiceSid: "MGc3fa1b1bb213ef12045067e46202e44b",
        to: `+91${phoneNumber}`,
    });
    // .then(message => console.log(message.sid))
    // .catch(error=> console.log(error))
});
exports.sendMessage = sendMessage;
