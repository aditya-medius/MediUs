import { Request, Response } from "express";

export class Base<T> {
    static Init<T>(this: new (...args: any[]) => T, ...args: any[]): T {
        return new this(...args);
    }
}