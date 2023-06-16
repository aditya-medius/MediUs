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
exports.getLikeById = exports.getDoctorsIHaveLikes = exports.likeExist = void 0;
const Doctor_Controller_1 = require("../../Controllers/Doctor.Controller");
const Likes_Model_1 = __importDefault(require("../../Models/Likes.Model"));
const likeExist = (likedDoctordId, likedBy) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doesLikeExist = yield Likes_Model_1.default.exists({
            doctor: likedDoctordId,
            likedBy: likedBy,
        });
        return Promise.resolve(doesLikeExist);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.likeExist = likeExist;
const getDoctorsIHaveLikes = (myId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let myLikes = yield Likes_Model_1.default
            .find({
            likedBy: myId,
            $or: [
                {
                    unlike: false,
                },
                {
                    unlike: { $exists: false },
                },
            ],
        })
            .populate({
            path: "doctor",
            select: Doctor_Controller_1.excludeDoctorFields,
            populate: {
                path: "specialization qualification",
            },
        });
        // .populate({ path: "qualification" })
        // .populate({ path: "Specialization" });
        return Promise.resolve(myLikes);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getDoctorsIHaveLikes = getDoctorsIHaveLikes;
const getLikeById = (likedDoctordId, likedBy) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(yield Likes_Model_1.default.findOne({ doctor: likedDoctordId, likedBy: likedBy }));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getLikeById = getLikeById;
