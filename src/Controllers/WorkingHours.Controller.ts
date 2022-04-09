import workingHourModel from "../Models/WorkingHours.Model";
import { Request, Response, Router } from "express";
import { errorResponse, successResponse } from "../Services/response";
import { addBodyPart } from "../Admin Controlled Models/Admin.Controller";
import { time } from "../Services/time.class";
import { dayArray, formatWorkingHour } from "../Services/WorkingHour.helper";
import { strict as assert } from "assert";
// For Doctors
export const createWorkingHours = async (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    body.doctorDetails = req.currentDoctor;
    let workingHour = await workingHourModel.find(
      {
        doctorDetails: req.currentDoctor,
        hospitalDetails: body.hospitalId,
      },
      { doctorDetails: 0, hospitalDetails: 0 }
    );

    const { hospitalId, ...tempBody } = body;
    if (workingHour.length >= 24) {
      let error = new Error("Cannot create more than 24 schedules");
      error.name = "Exceeded number of schedules";
      throw error;
    }

    workingHour.forEach((e: any) => {
      Object.keys(e.toJSON()).forEach((elem: any) => {
        if (dayArray.includes(elem)) {
          const element = e[elem];
          const e2 = tempBody.workingHour[elem];
          if (e2) {
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
        }
      });
    });
    let tb = { ...tempBody.workingHour };

    const WHObj = await new workingHourModel({
      doctorDetails: req.currentDoctor,
      hospitalDetails: body.hospitalId,
      ...tb,
    }).save();
    return successResponse(WHObj, "Successfully created", res);
    // return successResponse({}, "Successfully created", res);
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

    console.log("dsjbdssd:", WHObj);
    let WHObj2: any = {};
    if (WHObj) {
      WHObj.map((e) => {
        for (let data in e) {
          if (dayArray.includes(data)) {
            e[data] = { ...e[data], workingHour: e["_id"] };
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
      WHObj2 = formatWorkingHour([WHObj2]);
      return successResponse({ workingHours: WHObj2 }, "Success", res);
    } else {
      return successResponse({}, "No data found", res);
    }
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const updateWorkingHour = async (req: Request, res: Response) => {
  try {
    let { workingHour, ...rest } = req.body;

    let updateQuery = { $set: rest };
    let WH = await workingHourModel.find({
      _id: workingHour,
    });

    WH.forEach((e: any) => {
      Object.keys(e.toJSON()).forEach((elem: any) => {
        if (dayArray.includes(elem)) {
          const element = e[elem];
          const e2 = rest[elem];
          if (e2) {
            if (e2.working != element.working) {
              if (
                e2["from"].time == element["from"].time &&
                e2["till"].time == element["till"].time &&
                e2["from"].division == element["from"].division &&
                e2["till"].division == element["till"].division
              ) {
                return;
              } else {
                const t1_from = new time(e2.from.time, e2.from.division);
                const t1_till = new time(e2.till.time, e2.till.division);

                const t2_from = new time(
                  element.from.time,
                  element.from.division
                );
                const t2_till = new time(
                  element.till.time,
                  element.till.division
                );

                if (
                  !(
                    (t2_from.lessThan(t1_from) && t2_till.lessThan(t1_from)) ||
                    (t2_from.greaterThan(t1_till) &&
                      t2_till.greaterThan(t1_till))
                  )
                ) {
                  throw new Error("Invalid timings");
                }
              }
            } else {
              const t1_from = new time(e2.from.time, e2.from.division);
              const t1_till = new time(e2.till.time, e2.till.division);

              const t2_from = new time(
                element.from.time,
                element.from.division
              );
              const t2_till = new time(
                element.till.time,
                element.till.division
              );

              if (
                !(
                  (t2_from.lessThan(t1_from) && t2_till.lessThan(t1_from)) ||
                  (t2_from.greaterThan(t1_till) && t2_till.greaterThan(t1_till))
                )
              ) {
                throw new Error("Invalid timings");
              }
            }
          } else {
            throw new Error(`Doctor's timings does not exist for the day`);
          }
        }
      });
    });

    WH = await workingHourModel.findOneAndUpdate(
      {
        _id: workingHour,
      },
      updateQuery
    );
    return successResponse({}, "Success", res);
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
