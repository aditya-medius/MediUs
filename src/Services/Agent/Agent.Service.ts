import agentModel from "../../Models/Agent.Model";
import { encryptPassword, generateOTP, generateOTPtoken } from "../Utils";
import * as dotenv from "dotenv";
import { sendMessage } from "../message.service";
import otpModel from "../../Models/OTP.Model";
import * as jwt from "jsonwebtoken";

dotenv.config();

export const createAgentProfile = async (body: any) => {
  try {
    // if (body.password) {
    //   body.password = await encryptPassword(body.password);
    // } else {
    //   body.password = await encryptPassword(
    //     process.env.DEFAULT_PASSWORD as string
    //   );
    // }
    const agentData = await new agentModel(body).save();
    return Promise.resolve(agentData);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const login = async (body: any) => {
  try {
    if (!("OTP" in body)) {
      const OTP = await sendOTP(body.phoneNumber);
      return Promise.resolve({
        data: OTP,
        message: "OTP sent successfully",
      });
    } else {
      return Promise.resolve({
        data: await verifyOtpAndLogin(body),
        message: "Successfully logged in",
      });
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const sendOTP = async (phoneNumber: string) => {
  try {
    if (/^[0]?[6789]\d{9}$/.test(phoneNumber)) {
      let agentProfile: any = await agentModel.exists({
        phoneNumber: phoneNumber,
        "delData.deleted": false,
      });
      // if (!agentProfile) {
      //   return Promise.reject(
      //     new Error("Profile with this number doesn't exist")
      //   );
      // }
      const OTP: string = await generateOTP(phoneNumber);

      const otpToken = generateOTPtoken(OTP);
      await otpModel.findOneAndUpdate(
        { phoneNumber: phoneNumber },
        { $set: { phoneNumber: phoneNumber, otp: otpToken } },
        { upsert: true }
      );
      sendMessage(`Your OTP is: ${OTP}`, phoneNumber)
        .then(async (message: any) => {
          // Add OTP and phone number to temporary collection
        })
        .catch((error: any) => {
          return Promise.reject(error);
        });
      return Promise.resolve({});
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const verifyOtpAndLogin = async (body: any) => {
  try {
    const otpData = await otpModel.findOne({
      phoneNumber: body.phoneNumber,
      "delData.deleted": false,
    });

    const data: any = await jwt.verify(otpData.otp, body.OTP);
    if (Date.now() > data.expiresIn)
      return Promise.reject(new Error("OTP Expired"));
    if (body.OTP === data.otp) {
      // otpData.remove();
      let profile = await agentModel.findOne(
        {
          phoneNumber: body.phoneNumber,
          // "delData.deleted": false,
        },
        {
          location: 0,
          password: 0,
          delData: 0,
        }
      );

      if (!profile) {
        return Promise.reject({
          status: 201,
          message: "Account doesn't exist, create a new one",
        });
      }

      const token = await getAgentToken(profile.toJSON());
      return Promise.resolve({ token, ...profile.toJSON() });
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getAgentToken = async (body: any) => {
  const token = await jwt.sign(body, process.env.SECRET_AGENT_KEY as string);
  return token;
};
