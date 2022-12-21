import suvedhaModel from "../../Models/Suvedha.Model";
import { createAddress } from "../Address/Address.Service";
import {
  address,
  doctor,
  holidayCalendar,
  hospital,
  prescription,
  prescriptionValidity,
  qualification,
  qualificationNames,
} from "../schemaNames";
import { Types } from "mongoose";
import specialityModel from "../../Admin Controlled Models/Specialization.Model";
import doctorTypeModel from "../../Admin Controlled Models/DoctorType.Model";
import doctorModel from "../../Models/Doctors.Model";
import hospitalModel from "../../Models/Hospital.Model";

export const createSuvedhaProfile = async (suvedhaInfo: any) => {
  try {
    let { state, city, locality, addressLine_1, pincode, ...rest } =
      suvedhaInfo;
    if (state || city || locality || addressLine_1 || pincode) {
      let addressId = (
        await createAddress({
          state,
          city,
          locality,
          addressLine_1,
          pincode,
        })
      )._id;
      rest["address"] = addressId;
    }

    // let profile = await new suvedhaModel(rest).save();
    let profile = await suvedhaModel.findOneAndUpdate(
      { _id: suvedhaInfo?._id },
      { $set: rest },
      { new: true }
    );
    return Promise.resolve(profile);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const createCityFilterForDoctor = (cityId: string): Array<any> => {
  let query = [
    {
      $lookup: {
        from: hospital,
        localField: "hospitalDetails.hospital",
        foreignField: "_id",
        as: "hospitalDetails",
      },
    },
    {
      $unwind: "$hospitalDetails",
    },
    {
      $lookup: {
        from: address,
        localField: "hospitalDetails.address",
        foreignField: "_id",
        as: "hospitalDetails.address",
      },
    },
    {
      $match: {
        "hospitalDetails.address.city": new Types.ObjectId(cityId),
      },
    },
  ];
  return query;
};

export const createGenderFilterForDoctor = (gender: string): Array<any> => {
  let query: any = [
    {
      $match: {
        gender,
      },
    },
  ];
  return query;
};

export const createNameFilterForDoctor = (name: string) => {
  let query: any = [
    {
      $match: {
        firstName: { $regex: name, $options: "i" },
      },
    },
  ];
  return query;
};

export const createSpecilizationFilterForDoctor = (
  specializationId: string
) => {
  let query: any = [
    {
      $match: {
        specialization: specializationId,
      },
    },
  ];
  return query;
};

export const getHospital = async (body: any) => {
  try {
    let { specialization, type, city } = body;
    let specializationId = await specialityModel.findOne({
      specialityName: { $regex: specialization, $options: "i" },
    });

    let doctorIds = await doctorModel.find({
      specialization: { $in: [specializationId._id] },
    });

    if (doctorIds.length) {
      doctorIds = doctorIds.map((e: any) => e._id);
    }

    let query: any = { doctors: { $in: doctorIds } };

    type && (query = { ...query, type });

    let hospitals = await hospitalModel.find(query).populate({
      path: "address",
      populate: "city locality state country",
    });

    if (city) {
      hospitals = hospitals.filter((e: any) => {
        return e?.address?.city?._id.toString() === city;
      });
    }

    hospitals = hospitals.map((e: any) => {
      let address = e?.address;
      return {
        _id: e._id,
        name: e.name,
        locality: `${address?.city?.name}, ${address?.locality?.name}`,
        active: true,
      };
    });
    return Promise.resolve(hospitals);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsInAHospital = async (
  hospitalId: string,
  date: string
) => {
  try {
    const time = new Date(date);

    let year = time.getFullYear(),
      month = time.getMonth(),
      currentDate = time.getDate();

    let startDate = new Date(year, month, currentDate);
    let endDate = new Date(year, month, currentDate + 1);

    console.log("ygstratggc", startDate);
    console.log("knhgvdbdd", endDate);

    let doctors = await hospitalModel.aggregate([
      [
        {
          $match: {
            _id: new Types.ObjectId(hospitalId),
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctors",
            foreignField: "_id",
            as: "doctors",
          },
        },
        {
          $unwind: {
            path: "$doctors",
          },
        },
        {
          $project: {
            doctors: 1,
          },
        },
        {
          $lookup: {
            from: "qualifications",
            localField: "doctors.qualification",
            foreignField: "_id",
            as: "qualification",
          },
        },
        {
          $lookup: {
            from: "qualificationnames",
            localField: "qualification.qualificationName",
            foreignField: "_id",
            as: "qualificationName",
          },
        },
        {
          $addFields: {
            "doctors.qualification": {
              $first: "$qualification",
            },
          },
        },
        {
          $addFields: {
            "doctors.qualificationName": {
              $first: "$qualificationName",
            },
          },
        },
        {
          $lookup: {
            from: "workinghours",
            localField: "_id",
            foreignField: "hospitalDetails",
            as: "working",
          },
        },
        {
          $addFields: {
            "doctors.working": {
              $filter: {
                input: "$working",
                as: "working",
                cond: {
                  $eq: ["$$working.doctorDetails", "$doctors._id"],
                },
              },
            },
          },
        },
        {
          $addFields: {
            "doctors.fee": {
              $filter: {
                input: "$doctors.hospitalDetails",
                as: "fee",
                cond: {
                  $eq: ["$$fee.hospital", "$_id"],
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: holidayCalendar,
            localField: "doctors._id",
            foreignField: "doctorId",
            as: "holiday",
          },
        },
        {
          $addFields: {
            "doctors.holiday": {
              $filter: {
                input: "$holiday",
                as: "holiday",
                cond: {
                  $eq: ["$$holiday.hospitalId", "$_id"],
                },
              },
            },
          },
        },
        // {
        //   $match: {
        //     "doctors.holiday.date": { $gte: startDate, $lte: endDate },
        //   },
        // },
        {
          $addFields: {
            "doctors.holiday": {
              $filter: {
                input: "$doctors.holiday",
                as: "holiday",
                cond: {
                  $and: [
                    {
                      $gte: ["$$holiday.date", startDate],
                    },
                    {
                      $lte: ["$$holiday.date", endDate],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: prescriptionValidity,
            localField: "doctors._id",
            foreignField: "doctorId",
            as: "prescription",
          },
        },
        {
          $addFields: {
            "doctors.prescription": {
              $filter: {
                input: "$prescription",
                as: "prescription",
                cond: {
                  $eq: ["$$prescription.hospitalId", "$_id"],
                },
              },
            },
          },
        },
        {
          $unwind: "$doctors.prescription",
        },
        {
          $project: {
            "doctors.working": 1,
            "doctors.firstName": 1,
            "doctors.lastName": 1,
            "doctors.qualificationName": 1,
            "doctors.overallExperience": 1,
            "doctors._id": 1,
            "doctors.fee": 1,
            "doctors.holiday": 1,
            "doctors.prescription": 1,
          },
        },
      ],
    ]);

    return Promise.resolve(doctors);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const handleSpecialityType = async () => {};
