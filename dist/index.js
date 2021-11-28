"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./Services/db");
const Doctor_route_1 = __importDefault(require("./routes/Doctor.route"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use("/doctor", Doctor_route_1.default);
app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
