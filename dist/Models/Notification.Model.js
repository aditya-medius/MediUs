"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schemaNames_1 = require("../Services/schemaNames");
const options = { discriminatorKey: "kind" };
const notificationsSchema = new mongoose_1.Schema({
    notificationId: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: "sender_ref",
    },
    receiver: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: "receiver_ref",
    },
    sender_ref: {
        type: String,
        required: true,
    },
    receiver_ref: {
        type: String,
        required: true,
    },
    notificationType: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: schemaNames_1.notificationType,
    },
    content: {
        type: String,
    },
    readDetails: {
        isRead: {
            type: Boolean,
            default: false,
        },
        readDate: {
            type: Date,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}
// options
);
["find", "findOne"].forEach((e) => {
    notificationsSchema.pre(e, function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.populate("notificationType");
        });
    });
});
const notificationsModel = (0, mongoose_1.model)(schemaNames_1.notifications, notificationsSchema);
// const requestApprovalNotification = notificationsModel.discriminator(
//   "approvalRequest",
//   new Schema({
//     idKey: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "idPath",
//       required: true,
//     },
//     idPath: {
//       type: String,
//       required: true,
//     },
//   })
// );
exports.default = notificationsModel;
