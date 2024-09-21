import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import moment, { Moment, weekdays } from "moment";
import multer from "multer";
import * as path from "path";
import otpModel from "../Models/OTP.Model";
import { sendMessage } from "./message.service";
import * as http from "http";
import axios from "axios";
import hospitalModel from "../Models/Hospital.Model";
import patientModel from "../Models/Patient.Model";
import doctorModel from "../Models/Doctors.Model";

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

export const updateWorkingHour = (query: any, cb: Function) => { };

export const initUpload = (filepath: string) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${filepath}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      console.log(
        "file.fieldname",
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({ storage });

  return upload;
};

export const groupBy = function (xs: Array<any>, key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const getRangeOfDates = (year: number, month: number): [Date, Date] => {
  let startDate: Date = new Date(
    new Date(year, month - 1, 1, 6, 30, 0).toUTCString()
  );

  let endDate: Date = new Date(
    new Date(year, month, 1, 6, 30, 0).toUTCString()
  );

  return [startDate, endDate];
};

export const sendOTPForPasswordChange = async (phoneNumber: string) => {
  let OTP = await generateOTP(phoneNumber);
  let otpToken = generateOTPtoken(OTP);

  await otpModel.findOneAndUpdate(
    { phoneNumber: phoneNumber, for: "PASSWORD_CHANGE" },
    {
      $set: { phoneNumber: phoneNumber, otp: otpToken, for: "PASSWORD_CHANGE" },
    },
    { upsert: true }
  );

  // sendMessage(`Your OTP is: ${OTP}`, phoneNumber)
  //   .then(async (message: any) => {
  //     // Add OTP and phone number to temporary collection
  //   })
  //   .catch((error: any) => {
  //     return Promise.reject(error);
  //   });

  digiMilesSMS.sendOTPToPhoneNumber(phoneNumber, OTP);
};

export const verifyPasswordChangeOTP = async (
  phoneNumber: string,
  OTP: string
) => {
  try {
    const otpData = await otpModel.findOne({
      phoneNumber: phoneNumber,
      for: "PASSWORD_CHANGE",
      "delData.deleted": false,
    });

    const data: any = jwt.verify(otpData.otp, OTP);
    if (Date.now() > data.expiresIn)
      return Promise.reject(new Error("OTP Expired"));
    if (OTP === data.otp) {
      otpModel.findOneAndDelete({
        phoneNumber: phoneNumber,
        for: "PASSWORD_CHANGE",
      });
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const firebaseAxiosDoctor = axios.create({
  baseURL: "https://fcm.googleapis.com",
});
firebaseAxiosDoctor.interceptors.request.use((req) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `key=${process.env.FIREBASE_DOCTOR_API_KEY as string}`,
  };
  req.headers = headers;

  return req;
});

export const firebaseAxiosHospital = axios.create({
  baseURL: "https://fcm.googleapis.com",
});
firebaseAxiosHospital.interceptors.request.use((req) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `key=${process.env.FIREBASE_HOSPITAL_API_KEY as string}`,
  };

  req.headers = headers;

  return req;
});

export const firebaseAxiosPatient = axios.create({
  baseURL: "https://fcm.googleapis.com",
});
firebaseAxiosPatient.interceptors.request.use((req) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `key=${process.env.FIREBASE_PATIENT_API_KEY as string}`,
  };
  req.headers = headers;

  return req;
});

export const sendNotificationToDoctor = async (
  doctorFirebaseToken: string,
  notification: { body: string; title: string }
) => {
  firebaseAxiosDoctor.post("/fcm/send", {
    to: doctorFirebaseToken,
    notification,
  });
};

export const sendNotificationToHospital = async (
  hospitalFirebaseToken: string,
  notification: { body: string; title: string }
) => {
  firebaseAxiosHospital.post("/fcm/send", {
    to: hospitalFirebaseToken,
    notification,
  });
};

export const sendNotificationToPatient = async (
  patientFirebaseToken: string,
  notification: { body: string; title: string }
) => {
  firebaseAxiosPatient.post("/fcm/send", {
    to: patientFirebaseToken,
    notification,
  });
};

export const digiMilesSMS = {
  sendAppointmentConfirmationNotification: (
    phoneNumber: string,
    patientName: string,
    doctorName: string,
    hospitalName: string,
    date: string,
    time: string
  ) => {
    return axios.get(
      `http://route.digimiles.in/bulksms/bulksms?username=DG35-medius&password=digimile&type=0&dlr=1&destination=${phoneNumber}&source=MEDUST&message=Hi, ${patientName}. Your appointment with Dr. ${doctorName} at ${hospitalName} PM has been booked on ${date} between ${time}. Team Medius.&entityid=1501583880000052401&tempid=1507166324070972086`
    );
  },

  sendOTPToPhoneNumber: (phoneNumber: string, otp: string) => {
    return axios.get(
      `http://route.digimiles.in/bulksms/bulksms?username=DG35-medius&password=digimile&type=0&dlr=1&destination=${phoneNumber}&source=MEDUST&message=${otp} is the OTP to validate your account with Medius. OTP is valid only for 60 seconds. Team Medius.&entityid=1501583880000052401&tempid=1507166324007499032`
    );
  },
};

export const addDays = (date: any, days: any) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;

}

export const getDateDifference = (date1: Date | Moment, date2: Date | Moment) => {
  date2 = moment(date2)
  date1 = moment(date1)
  const difference = date2.diff(date1, "days")
  return difference
}

export const getDateDifferenceFromCurrentDate = (date: Date) => {
  return getDateDifference(new Date(), date)
}

export const sendOTPToPhoneNumber = async (phoneNumber: string) => {
  let OTP = await generateOTP(phoneNumber);
  let otpToken = generateOTPtoken(OTP);

  await otpModel.findOneAndUpdate(
    { phoneNumber: phoneNumber },
    {
      $set: { phoneNumber: phoneNumber, otp: otpToken },
    },
    { upsert: true }
  );

  digiMilesSMS.sendOTPToPhoneNumber(phoneNumber, OTP);
  return Promise.resolve()
}

export const verifyPhoneNumber = async (id: string, idOf: string) => {
  let userModel = null
  switch (idOf) {
    case "doctor": {
      userModel = doctorModel;
      break
    }
    case "patient": {
      userModel = patientModel;
      break
    }
    case "hospital": {
      userModel = hospitalModel;
      break
    }
  }
  await userModel?.findOneAndUpdate({ _id: id }, { $set: { phoneNumberVerified: true, lastTimePhoneNumberVerified: new Date() } })
  return
}

export const formatTime = (time: string): string => {
  return moment(time, 'HH:mm').format('hh:mm A');
}
