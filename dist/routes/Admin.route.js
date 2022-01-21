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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = __importStar(require("../Admin Controlled Models/Admin.Controller"));
const adminRouter = (0, express_1.Router)();
adminRouter.post("/addSpeciality", adminController.addSpeciality);
// Body part
adminRouter.post("/addBodyPart", adminController.addBodyPart);
adminRouter.post("/addSpecialityBody", adminController.addSpecialityBody);
adminRouter.post("/addToSpecialityBody/:id", adminController.addToSpecialityBody);
// Disease
adminRouter.post("/addDisease", adminController.addDisease);
adminRouter.post("/addSpecialityDisease", adminController.addSpecialityDisease);
adminRouter.post("/addToSpecialityDisease/:id", adminController.addToSpecialityDisease);
// Doctor Type
adminRouter.post("/addDoctorType", adminController.addDoctorType);
adminRouter.post("/addSpecialityDoctorType", adminController.addSpecialityDoctorType);
adminRouter.post("/addToSpecialityDoctorType/:id", adminController.addToSpecialityDoctorType);
//routes for city anemity address state country
adminRouter.post("/city", adminController.addCity);
adminRouter.post("/state", adminController.addState);
adminRouter.post("/locality", adminController.addLocality);
adminRouter.post("/country", adminController.addCountry);
adminRouter.post("/payment", adminController.addPayment);
adminRouter.get("/getPaymentOptions", adminController.getPayments);
// Get cities, states, locality and country
adminRouter.get("/getCityStateLocalityCountry", adminController.getCityStateLocalityCountry);
// Create admin profile
adminRouter.post("/create", adminController.create);
// Get admin profile
adminRouter.get("/login", adminController.login);
exports.default = adminRouter;
