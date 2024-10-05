"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.TaskManager = void 0;
const Helpers_1 = require("../Services/Helpers");
const Handler_1 = require("../Handler");
class TaskManager {
    constructor(cb) {
        this.validationHandler = new Handler_1.ValidationHandler();
        this.callback = cb;
    }
    execute(...args) {
        const mode = args.slice(-1)[0];
        if (typeof mode === "string" && mode === Helpers_1.Mode.RESPONSE) {
            const [req, res, next, message = "Success"] = args.slice(0, -1);
            return this.manageResponse(req, res, message);
        }
        else {
            const [message] = args;
            return this.manageService(message);
        }
    }
    manageService(successMessage = "Success") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callback();
        });
    }
    manageResponse(req, res, successMessage = "Success") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callback();
        });
    }
}
__decorate([
    Handler_1.ErrorHandler.handleException("service"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskManager.prototype, "manageService", null);
__decorate([
    Handler_1.ErrorHandler.handleException("response"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TaskManager.prototype, "manageResponse", null);
exports.TaskManager = TaskManager;
