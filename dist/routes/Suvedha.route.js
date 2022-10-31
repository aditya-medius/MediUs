"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Suvedha_auth_1 = require("../authentication/Suvedha.auth");
const suvedha_Controller_1 = require("../Controllers/suvedha.Controller");
const middlewareHelper_1 = require("../Services/middlewareHelper");
const suvedhaRouter = (0, express_1.Router)();
suvedhaRouter.get("/getDoctors", (0, middlewareHelper_1.oneOf)(Suvedha_auth_1.authenticateSuvedha), suvedha_Controller_1.getDoctors);
exports.default = suvedhaRouter;
