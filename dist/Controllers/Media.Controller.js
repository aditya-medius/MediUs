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
exports.uploadImage = void 0;
const Media_model_1 = __importDefault(require("../Models/Media.model"));
const response_1 = require("../Services/response");
const schemaNames_1 = require("../Services/schemaNames");
const uploadImage = (req, res, paths = "user") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let user = "";
        if (req.currentDoctor) {
            user = schemaNames_1.doctor;
        }
        else if (req.currentHospital) {
            user = schemaNames_1.hospital;
        }
        else if (req.currentPatient) {
            user = schemaNames_1.patient;
        }
        else if (req.currentSuvedha) {
            user = schemaNames_1.suvedha;
        }
        else if (req.currentAdmin) {
            user = body.user;
        }
        const mediaBody = {
            userType: user,
            user: body.userId,
            image: req.file
                ? `${process.env.MEDIA_DIR}/${paths}/${req.file.filename}`
                : ""
        };
        let mediaObj = yield new Media_model_1.default(mediaBody).save();
        return (0, response_1.successResponse)({ response: mediaObj }, "Success", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.uploadImage = uploadImage;
