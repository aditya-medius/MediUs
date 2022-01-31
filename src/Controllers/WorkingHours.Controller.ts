import workingHourModel from "../Models/WorkingHours.Model";
import { Request, Response, Router } from "express";
import { errorResponse, successResponse } from "../Services/response";
import { addBodyPart } from "../Admin Controlled Models/Admin.Controller";
import { time } from "../Services/time.class";
import { formatWorkingHour } from "../Services/WorkingHour.helper";

// For Doctors
export const createWorkingHours = async (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    body.doctorDetails = req.currentDoctor;
    let workingHour = await workingHourModel.find(
      {
        doctorDetails: req.currentDoctor,
        hospitalDetails: body.hospitalDetails,
      },
      { doctorDetails: 0, hospitalDetails: 0 }
    );

    const { doctorDetails, hospitalDetails, ...tempBody } = body;
    workingHour.forEach((e: any) => {
      Object.keys(e.toJSON()).forEach((elem: any) => {
        if (elem != "_id" && elem != "__v") {
          const element = e[elem];
          const e2 = tempBody[elem];
          const t1_from = new time(e2.from.time, e2.from.division);
          const t1_till = new time(e2.till.time, e2.till.division);

          const t2_from = new time(element.from.time, element.from.division);
          const t2_till = new time(element.till.time, element.till.division);

          if (
            !(
              (t2_from.lessThan(t1_from) && t2_till.lessThan(t1_from)) ||
              (t2_from.greaterThan(t1_till) && t2_till.greaterThan(t1_till))
            )
          ) {
            throw new Error("Invalid timings");
          }
        }
      });
    });

    const WHObj = await new workingHourModel(body).save();
    // return successResponse({}, "Successfully created", res);
    return successResponse(WHObj, "Successfully created", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

// For Hospitals
export const createOpeningHours = async (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    body["byHospital"] = true;
    const WHObj = await new workingHourModel(body).save();
    return successResponse(WHObj, "Successfully created", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

// Get working hours
export const getWorkingHours = async (req: Request, res: Response) => {
  try {
    const WHObj = await workingHourModel
      .find(
        {
          doctorDetails: req.body.doctorDetails,
          hospitalDetails: req.body.hospitalDetails,
        },
        "-byHospital -doctorDetails -hospitalDetails"
      )
      .lean();
    let WHObj2: any = {};
    if (WHObj) {
      WHObj.map((e) => {
        for (let data in e) {
          if (data != "_id" && data != "__v") {
            if (WHObj2[data]) {
              WHObj2[data] = [...WHObj2[data], e[data]];
            } else {
              WHObj2[data] = [e[data]];
            }
          } else {
            WHObj2[data] = e[data];
          }
        }
      });
      // return successResponse({ WHObj, WHObj2 }, "Success", res);
      WHObj2 = formatWorkingHour([WHObj2]);
      console.log("Who:", WHObj2);
      return successResponse({ workingHours: WHObj2 }, "Success", res);
    } else {
      return successResponse({}, "No data found", res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

function timeLessThan(t1: any, t2: any) {
  if (t1.division == 1 && t2.division == 0) {
    return false;
  }
  if (t1.division == 1 && t2.division == 1) {
    if (t1.time < t2.time) {
      return true;
    } else if (t1.time > t2.time) {
      return false;
    }
  }
  if (t1.division == 0 && t2.division == 1) {
    return true;
  }
}

function tiemGreaterThan(t1: any, t2: any) {
  if (t1.division == 1 && t2.division == 0) {
    return true;
  }
  if (t1.division == 1 && t2.division == 1) {
    if (t1.time > t2.time) {
      return true;
    } else if (t1.time < t2.time) {
      return false;
    }
  }
  if (t1.division == 0 && t2.division == 1) {
    return false;
  }
}
