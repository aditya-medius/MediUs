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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// import bodyParser from "body-parser";
require("./Services/db");
const Doctor_route_1 = __importDefault(require("./routes/Doctor.route"));
const Hospital_route_1 = __importDefault(require("./routes/Hospital.route"));
const Admin_route_1 = __importDefault(require("./routes/Admin.route"));
const Patient_route_1 = __importDefault(require("./routes/Patient.route"));
const Agent_route_1 = __importDefault(require("./routes/Agent.route"));
const Common_route_1 = __importDefault(require("./routes/Common.route"));
const path_1 = __importDefault(require("path"));
const Feedback_route_1 = __importDefault(require("./routes/Feedback.route"));
const middlewareHelper_1 = require("./Services/middlewareHelper");
const Doctor_auth_1 = require("./authentication/Doctor.auth");
const Hospital_auth_1 = require("./authentication/Hospital.auth");
const Patient_auth_1 = require("./authentication/Patient.auth");
// Cron Jobs
// cronJobService.cronFunctions.forEach((e: Function) => {
//   e();
// });
dotenv.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/doctor", Doctor_route_1.default);
app.use("/hospital", Hospital_route_1.default);
app.use("/admin", Admin_route_1.default);
app.use("/patient", Patient_route_1.default);
app.use("/common", Common_route_1.default);
app.use("/feedback", Feedback_route_1.default);
app.use("/agent", Agent_route_1.default);
app.use("/static", express_1.default.static(path_1.default.join(__dirname, "./src/uploads")));
app.use("/static", middlewareHelper_1.tokenNikalo, (0, middlewareHelper_1.oneOf)(Doctor_auth_1.authenticateDoctor, Hospital_auth_1.authenticateHospital, Patient_auth_1.authenticatePatient), express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.get("test", (req, res) => {
    res.send("Hello");
});
app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
