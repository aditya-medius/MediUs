import workingHourModel from "../Models/WorkingHours.Model";
import { Request, Response, Router } from "express";
import { errorResponse, successResponse } from "../Services/response";
import { addBodyPart } from "../Admin Controlled Models/Admin.Controller";

export const createWorkingHours = async (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    body.doctorDetails = req.currentDoctor;
    const workingHour: Array<any> = await workingHourModel.find(
      {
        doctorDetails: req.currentDoctor,
        // hospitalDetails: body.hospitalId,
      },
      { doctorDetails: 0 }
    );

    // Yeh poora delete ho skta hai...shayad
    workingHour.forEach((e: any) => {
      if (
        !(
          (body.monday.from.time < e.monday.from.time &&
            body.monday.till.time < e.monday.from.time) ||
          (body.monday.from.time > e.monday.till.time &&
            body.monday.till.time > e.monday.till.time)
        )
      ) {
        throw new Error("Invalid timings");
      } else if (
        !(
          (body.tuesday.from.time < e.tuesday.from.time &&
            body.tuesday.till.time < e.tuesday.from.time) ||
          (body.tuesday.from.time > e.tuesday.till.time &&
            body.tuesday.till.time > e.tuesday.till.time)
        )
      ) {
        throw new Error("Invalid timings");
      } else if (
        !(
          (body.wednesday.from.time < e.wednesday.from.time &&
            body.wednesday.till.time < e.wednesday.from.time) ||
          (body.wednesday.from.time > e.wednesday.till.time &&
            body.wednesday.till.time > e.wednesday.till.time)
        )
      ) {
        throw new Error("Invalid timings");
      } else if (
        !(
          (body.thursday.from.time < e.thursday.from.time &&
            body.thursday.till.time < e.thursday.from.time) ||
          (body.thursday.from.time > e.thursday.till.time &&
            body.thursday.till.time > e.thursday.till.time)
        )
      ) {
        throw new Error("Invalid timings");
      } else if (
        !(
          (body.friday.from.time < e.friday.from.time &&
            body.friday.till.time < e.friday.from.time) ||
          (body.friday.from.time > e.friday.till.time &&
            body.friday.till.time > e.friday.till.time)
        )
      ) {
        throw new Error("Invalid timings");
      } else if (
        !(
          (body.saturday.from.time < e.saturday.from.time &&
            body.saturday.till.time < e.saturday.from.time) ||
          (body.saturday.from.time > e.saturday.till.time &&
            body.saturday.till.time > e.saturday.till.time)
        )
      ) {
        throw new Error("Invalid timings");
      } else if (
        !(
          (body.sunday.from.time < e.sunday.from.time &&
            body.sunday.till.time < e.sunday.from.time) ||
          (body.sunday.from.time > e.sunday.till.time &&
            body.sunday.till.time > e.sunday.till.time)
        )
      ) {
        throw new Error("Invalid timings");
      }
    });

    const WHObj = await new workingHourModel(body).save();
    return successResponse(WHObj, "Successfully created", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

function timeLessThan(t1: any, t2: any) {
  console.log("t1: ", t1, "\nt2: ", t2);
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
