"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneNumberValidation = exports.emailValidation = void 0;
const emailValidation = (email) => {
    const regex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
    if (regex.test(email))
        return true;
    return false;
};
exports.emailValidation = emailValidation;
const phoneNumberValidation = (phoneNumber) => {
    const regex = /^[0]?[6789]\d{9}$/;
    if (regex.test(phoneNumber))
        return true;
    return false;
};
exports.phoneNumberValidation = phoneNumberValidation;
