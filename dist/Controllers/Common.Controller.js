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
exports.SetProfileImage = void 0;
const Common_Service_1 = require("../Services/Common/Common.Service");
const response_1 = require("../Services/response");
const SetProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, profileImageUrl, uploadFor } = req.body;
        const result = yield (0, Common_Service_1.setProfileImage)(userId, profileImageUrl, uploadFor);
        return (0, response_1.successResponse)(result, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.SetProfileImage = SetProfileImage;
