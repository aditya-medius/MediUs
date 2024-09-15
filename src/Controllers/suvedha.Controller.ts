import { Request, Response } from "express";
import {
  getDoctorById_ForSuvedha,
  getDoctorsWithAdvancedFilters,
} from "../Services/Doctor/Doctor.Service";
import * as doctorService from "../Services/Doctor/Doctor.Service";
import { errorResponse, successResponse } from "../Services/response";
import { createSuvedhaProfile } from "../Services/Suvedha/Suvedha.Service";
import * as suvedhaService from "../Services/Suvedha/Suvedha.Service";

export const createProfile = async (req: Request, res: Response) => {
  try {
    let profile = await createSuvedhaProfile(req.body);
    return successResponse(profile, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
import moment, { weekdays } from "moment";
import { formatTime } from "../Services/Utils";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    let userId: string = "";

    if (req.currentSuvedha) {
      userId = req.currentSuvedha;
    } else if (req.currentPatient) {
      userId = req.currentPatient;
    }

    let doctors = await getDoctorsWithAdvancedFilters(userId, req.query);
    let response = doctors.map((e: any) => {
      return {
        firstName: e.firstName,
        lastName: e.lastName,
        gender: e.gender,
        specialityName:
          e?.specialization?.length > 0
            ? e.specialization[0].specialityName
            : "",
        liked: e?.liked?.length > 0 ? true : false,
        abbreviation:
          e?.qualification?.length > 0
            ? e.qualification
              .filter((elem: any) =>
                elem.qualificationName?.[0]?.abbreviation ? true : false
              )
              .map((elem: any) => elem.qualificationName?.[0]?.abbreviation)
              .flat()
            : [],
        overallExperience: e.overallExperience,
        _id: e._id,
      };
    });
    return successResponse(response, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorInfo = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let doctors: any = await getDoctorById_ForSuvedha(id);
    return successResponse(doctors, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getValidDateOfDoctorsSchedule = async (
  req: Request,
  res: Response
) => {
  try {
    let { doctorId, date } = req.body;
    let data = await doctorService.getDoctorWorkingDays(doctorId),
      holidays;
    if (date) {
      holidays = await doctorService.isDateHolidayForDoctor(date, doctorId);
      doctorService.canDoctorTakeMoreAppointments(date, doctorId);
    }
    return successResponse({ workingDays: data, holidays }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorInformation = async (req: Request, res: Response) => {
  try {
    let data: any = await doctorService.getDoctorInfo(
      req.body.doctorId,
      req.body.date
    );

    const WEEKDAYS = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const time = new Date(req.body.date);

    let d: any = time.getDay();

    let day = WEEKDAYS[d - 1];

    data = data.map((e: any) => {
      return {
        _id: e.hospitalDetails._id,
        fee: e.fee[0].consultationFee?.min,
        hospital_name: e.hospitalDetails.name,
        Address: e.hospitalDetails.address,
        // fee:
        //   e?.hospitalDetails?.prescription?.length > 0
        //     ? e?.hospitalDetails.prescription?.find(
        //         (elem: any) =>
        //           elem.hospital.toString() === e.hospitalDetails._id.toString()
        //       )?.consultationFee.min
        //     : null,
        precription_validity: e?.hospitalDetails?.validity?.[0]?.validateTill,
        hospital_times: (() => {
          let currentDate = moment(time).format("DD-MM-YYYY");
          if (e[day]) {
            let { from, till } = e[day];

            const appointmentStartTime = formatTime(`${from.time}:${from.division}`)
            const appointmentEndTime = formatTime(`${till.time}:${till.division}`)

            let find = e.holidayCalendar?.find((elem: any) => {
              let date = moment(elem.date).format("DD-MM-YYYY");
              return date === currentDate;
            });
            return [
              {
                available: find ? false : true,
                Time: `${appointmentStartTime} to ${appointmentEndTime}`,
              },
            ];
          }
          return [
            {
              available: false,
              Time: null,
            },
          ];
        })(),
      };
    });

    let doctorData: Array<any> = [];

    data.forEach((e: any) => {
      let exist = doctorData.find(
        (elemt: any) => e._id.toString() === elemt._id.toString()
      );

      if (!exist) {
        doctorData.push(e);
      }
    });
    return successResponse({ data: doctorData }, "Success", res);
    return successResponse({ data }, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getHospital = async (req: Request, res: Response) => {
  try {
    let { type, specialization, city } = req.query;
    return successResponse(
      await suvedhaService.getHospital({ type, specialization, city }),
      "Success",
      res
    );
  } catch (error: any) {
    return errorResponse(error, res);
  }
};

export const getDoctorsInAHospital = async (req: Request, res: Response) => {
  try {
    let data: any = await suvedhaService.getDoctorsInAHospital(
      req.body.hospitalId,
      req.body.time
    );

    const WEEKDAYS = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    let day: any = new Date(req.body.time).getDay();

    let doctors = data.map((e: any) => {
      let doc = e.doctors;
      return {
        id: doc._id,
        name: `${doc.firstName} ${doc.lastName}`,
        qualification: doc.qualificationName,
        experience: doc.overallExperience,
        fee: doc.fee[0].consultationFee.min,
        hopsital_times: doc?.working?.map((elem: any) => {
          let [
            _id,
            doctorDetails,
            hospitalDetails,
            rest,
            byHospital,
            deleted,
            __v,
          ] = Object.keys(elem);

          let available = true;
          if (doc.holiday.length > 0) {
            if (WEEKDAYS[day] === rest) {
              available = false;
            }
          }
          return {
            available,
            Time: `${elem[rest]?.from?.time}:${elem[rest]?.from?.division} to ${elem[rest]?.till?.time}:${elem[rest]?.till?.division}`,
          };
        }),

        prescription: `${doc.prescription.validateTill} Days`,
      };
    });

    // doctors = data;

    return successResponse(doctors, "Success", res);
    return successResponse(data, "Success", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
