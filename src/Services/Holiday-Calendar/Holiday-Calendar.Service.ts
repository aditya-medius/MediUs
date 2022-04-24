import holidayModel from "../../Models/Holiday-Calendar.Model";
import { getRangeOfDates } from "../Utils";

export const addHolidayCalendar = async (body: any) => {
  try {
    let holidayData = await new holidayModel(body).save();
    return Promise.resolve(holidayData);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsHolidayList = async (
  doctorId: string,
  year: number,
  month: number
) => {
  try {
    let [startDate, endDate] = getRangeOfDates(year, month);
    let holidayList = await holidayModel.find(
      {
        doctorId,
        date: { $gte: startDate, $lt: endDate },
        "delData.deleted": false,
      },
      {
        delData: 0,
      }
    );
    return Promise.resolve(holidayList);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const deleteHolidayCalendar = async (holidayId: string) => {
  try {
    let del_holiday = await holidayModel.findOneAndUpdate(
      { _id: holidayId },
      { $set: { "delData.deleted": true, "delData.deletedAt": new Date() } }
    );
    return Promise.resolve(del_holiday);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
