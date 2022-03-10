import mongoose, { Schema, model } from "mongoose";
import { agent } from "../Services/schemaNames";

const agentSchema: Schema = new Schema({
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    length: 10,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

agentSchema.pre("save", async function (next) {
  const agentProfile = await agentModel.findOne({
    phoneNumber: this.phoneNumber,
  });

  if (agentProfile) {
    throw new Error("Agent profile already exist");
  }
  next();
});

const agentModel = model(agent, agentSchema);
export default agentModel;
