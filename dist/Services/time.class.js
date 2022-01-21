"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.time = void 0;
class time {
    // h: number;
    // m: number;
    constructor(h, m) {
        this.h = h;
        this.m = m;
        // this.h = h;
        // this.m = m;
    }
    lessThan(t) {
        if (this.h > t.h) {
            return false;
        }
        else if (this.h < t.h) {
            return true;
        }
        else if (this.h == t.h) {
            if (Math.abs(this.m - t.m) > 15) {
                if (this.m > t.m || this.m == t.m) {
                    return false;
                }
                else
                    return true;
            }
            else {
                throw new Error("Timings must be greate than 15 mins");
            }
        }
    }
    greaterThan(t) {
        if (this.h < t.h) {
            return false;
        }
        else if (this.h > t.h) {
            return true;
        }
        else if (this.h == t.h) {
            if (Math.abs(this.m - t.m) > 15) {
                if (this.m < t.m || this.m == t.m) {
                    return false;
                }
                else
                    return true;
            }
            else {
                throw new Error("Timings must be greate than 15 mins");
            }
        }
    }
}
exports.time = time;
