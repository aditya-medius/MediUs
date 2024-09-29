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
exports.TaskRunner = void 0;
const Helpers_1 = require("../Services/Helpers");
const Task_Manager_1 = require("./Task.Manager");
class TaskRunner {
    static Bundle(responseType = false) {
        return (target, propertyKey, descriptor) => {
            const originalMethod = descriptor.value; // Reference to the original method
            descriptor.value = function (...args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const taskManager = new Task_Manager_1.TaskManager(() => __awaiter(this, void 0, void 0, function* () {
                        return yield originalMethod.apply(this, args);
                    }));
                    if (responseType) {
                        args.push(Helpers_1.Mode.RESPONSE);
                    }
                    return yield taskManager.execute(...args); // Execute taskManager with req and res
                });
            };
            return descriptor; // Return the updated descriptor
        };
    }
}
exports.TaskRunner = TaskRunner;
