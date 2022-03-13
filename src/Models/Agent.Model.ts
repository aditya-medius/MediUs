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
  alternateNumber: {
    type: String,
    length: 10,
  },
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  photoIdentityNumber: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    },
  },
  image: {
    type: String,
    default: "static/user/default.png",
    // ref: media,
  },
  verified: {
    type: Boolean,
    default: false,
  },

  delData: {
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  DOB: {
    type: Date,
  },
});

// agentSchema.pre("find", async function (next) {
//   const query = this.getQuery();
//   // const data = this.where({
//   //   ...query,
//   //   "delData.deleted": false,
//   // });

//   next();
// });

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
