import { Router } from "express";
import { authenticateSuvedha } from "../authentication/Suvedha.auth";
import { getDoctors } from "../Controllers/suvedha.Controller";
import { oneOf } from "../Services/middlewareHelper";
const suvedhaRouter = Router();

suvedhaRouter.get("/getDoctors", oneOf(authenticateSuvedha), getDoctors);
export default suvedhaRouter;
