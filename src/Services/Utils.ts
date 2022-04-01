import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import moment from "moment";

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

export const getAge = (dob: Date) => {
  const exp = moment(new Date(dob));
  const currentDate = moment(new Date());

  let age: any = currentDate.diff(exp, "years", true);
  if (age < 1) {
    age = currentDate.diff(exp, "months");
    age = `${age} Months`;
  } else {
    age = `${age} Years`;
  }
  return age;
};

export const getDayFromWorkingHours = (body: any) => {
  const rd: Date = new Date(body.time.date);
  const d = rd.getDay();
  return d;
};

export const setFormatForWorkingHours = (day: number, b: any) => {
  let dayArr: Array<string> = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  let query: any = {};
  query[`${dayArr[day]}.working`] = true;
  query[`${dayArr[day]}.from.time`] = b.time.from.time;
  query[`${dayArr[day]}.from.division`] = b.time.from.division;
  query[`${dayArr[day]}.till.time`] = b.time.till.time;
  query[`${dayArr[day]}.till.division`] = b.time.till.division;
  return { workingHour: query, day: dayArr[day] };
};
export const formatWorkingHourDayForAppointment = (body: any) => {
  const d = getDayFromWorkingHours(body);
  let b = body;
  let query: any = setFormatForWorkingHours(d, b);
  // if (d == 0) {
  //   query["sunday.working"] = true;
  //   query["sunday.from.time"] = b.time.from.time;
  //   query["sunday.from.division"] = b.time.from.division;
  //   query["sunday.till.time"] = b.time.till.time;
  //   query["sunday.till.division"] = b.time.till.division;
  // } else if (d == 1) {
  //   query["monday.working"] = true;
  //   query["monday.from.time"] = b.time.from.time;
  //   query["monday.from.division"] = b.time.from.division;
  //   query["monday.till.time"] = b.time.till.time;
  //   query["monday.till.division"] = b.time.till.division;
  // } else if (d == 2) {
  //   query["tuesday.working"] = true;
  //   query["tuesday.from.time"] = b.time.from.time;
  //   query["tuesday.from.division"] = b.time.from.division;
  //   query["tuesday.till.time"] = b.time.till.time;
  //   query["tuesday.till.division"] = b.time.till.division;
  // } else if (d == 3) {
  //   query["wednesday.working"] = true;
  //   query["wednesday.from.time"] = b.time.from.time;
  //   query["wednesday.from.division"] = b.time.from.division;
  //   query["wednesday.till.time"] = b.time.till.time;
  //   query["wednesday.till.division"] = b.time.till.division;
  // } else if (d == 4) {
  //   query["thursday.working"] = true;
  //   query["thursday.from.time"] = b.time.from.time;
  //   query["thursday.from.division"] = b.time.from.division;
  //   query["thursday.till.time"] = b.time.till.time;
  //   query["thursday.till.division"] = b.time.till.division;
  // } else if (d == 5) {
  //   query["friday.working"] = true;
  //   query["friday.from.time"] = b.time.from.time;
  //   query["friday.from.division"] = b.time.from.division;
  //   query["friday.till.time"] = b.time.till.time;
  //   query["friday.till.division"] = b.time.till.division;
  // } else if (d == 6) {
  //   query["saturday.working"] = true;
  //   query["saturday.from.time"] = b.time.from.time;
  //   query["saturday.from.division"] = b.time.from.division;
  //   query["saturday.till.time"] = b.time.till.time;
  //   query["saturday.till.division"] = b.time.till.division;
  // }

  return query;
};

export const updateWorkingHour = (query: any, cb: Function) => {};
