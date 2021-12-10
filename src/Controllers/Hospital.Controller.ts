import { json, Request, Response } from "express";
import addressModel from "../Models/Address.Model";
import anemityModel from "../Models/Anemities.Model";
import hospitalModel from "../Models/Hospital.Model";
import specialityModel from "../Models/Speciality.Model";
import { errorResponse, successResponse } from "../Services/response";
import hospitalSpecialityModel from "../Models/HospitalSpeciality.Model";

export const getAllHospitalsList = async (req: Request, res: Response) => {
  try {
    const hospitalList = await hospitalModel.find(
      {deleted: false}
    );
    return successResponse(hospitalList, "Successfully fetched Hospital's list", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
//create a hospital
export const createHospital = async (req: Request, res: Response) => {
  try {
   let body=req.body;
   let hospitalObj= await new hospitalModel(body).save();
    return successResponse(hospitalObj,"Hospital created successfully", res);
  }
    catch (error: any) {
    return errorResponse(error, res);
  }
};

//add anemity
export const createHospitalAnemity = async(req: Request, res:Response)=>{
  try{
    let body=req.body;
    let anemityObj=await new anemityModel(body).save();
        return successResponse(anemityObj, "Address has been successfully added",res);
      }
  catch(error: any){
    return errorResponse(error, res);
  }
};

//add hospital speciality
export const addHospitalSpeciality= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let specialityObj=await new hospitalSpecialityModel(body).save();
      return successResponse(specialityObj, "Speciality has been successfully added",res);
  }
  catch(error: any){
    return errorResponse(error, res);
  }
};

//add address
export const addAddress= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let addressObj=await new addressModel(body).save();
    return successResponse(addressObj, "Address has been successfully added",res);
  }
  catch(error: any){
    return errorResponse(error, res);
  }
};