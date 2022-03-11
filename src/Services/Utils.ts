import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const phoneNumberRegex: RegExp = /^[0]?[6789]\d{9}$/;

export const encryptPassword = async (password: string) => {
  try {
    let cryptSalt = await bcrypt.genSalt(10);
    let encPassword = await bcrypt.hash(password, cryptSalt);
    return Promise.resolve(encPassword);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

// export const checkPasswordHas = async (password: string) => {
//   try {
//   } catch (error: any) {
//     return Promise.reject(error);
//   }
// };

export const generateOTP = async (phoneNumber: string) => {
  if (phoneNumberRegex.test(phoneNumber)) {
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("jdfjnjndf", OTP);
    return Promise.resolve(OTP);
  } else {
    return Promise.reject("Invalid Phone Number");
  }
};

export const generateOTPtoken = (OTP: string) => {
  const otpToken = jwt.sign(
    { otp: OTP, expiresIn: Date.now() + 5 * 60 * 60 * 60 },
    OTP
  );
  return otpToken;
};
