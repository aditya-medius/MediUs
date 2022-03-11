import { Router } from "express";
import * as agentController from "../Controllers/Agent.Controller";
const agentRouter = Router();

agentRouter.post("/createAgentProfile", agentController.createAgentProfile);

agentRouter.put("/login", agentController.login);

export default agentRouter;
