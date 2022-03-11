import agentModel from "../../Models/Agent.Model";

export const createAgentProfile = async (body: Object) => {
  try {
    const agentData = await new agentModel(body).save();
    return Promise.resolve(agentData);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
