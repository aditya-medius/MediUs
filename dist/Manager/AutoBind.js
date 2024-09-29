"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBind = void 0;
function AutoBind(constructor) {
    return class extends constructor {
        constructor(...args) {
            super(...args);
            const methodNames = Object.getOwnPropertyNames(constructor.prototype);
            for (const methodName of methodNames) {
                const method = this[methodName];
                if (typeof method === 'function' && methodName !== 'constructor') {
                    this[methodName] = method.bind(this);
                }
            }
        }
    };
}
exports.AutoBind = AutoBind;
