"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
class Base {
    static Init(...args) {
        return new this(...args);
    }
}
exports.Base = Base;
