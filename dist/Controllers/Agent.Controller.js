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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createAgentProfile = void 0;
const response_1 = require("../Services/response");
const agentService = __importStar(require("../Services/Agent/Agent.Service"));
const createAgentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield agentService.createAgentProfile(req.body);
        return (0, response_1.successResponse)(data, "Successfully created agent profile", res);
    }
    catch (error) {
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.createAgentProfile = createAgentProfile;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield agentService.login(req.query);
        return (0, response_1.successResponse)(data.data, data.message, res);
    }
    catch (error) {
        if (error.status) {
            let err = new Error(error.message);
            return (0, response_1.errorResponse)(err, res, error.status);
        }
        return (0, response_1.errorResponse)(error, res);
    }
});
exports.login = login;
