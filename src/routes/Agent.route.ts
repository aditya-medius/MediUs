import { Router } from "express";
import * as agentController from "../Controllers/Agent.Controller";
const router = Router();

router.post("/createAgentProfile", agentController.createAgentProfile);

export default router;
