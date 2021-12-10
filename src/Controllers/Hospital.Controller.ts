import { json, Request, Response } from "express";
import addressModel from "../Models/Address.Model";
import anemityModel from "../Models/Anemities.Model";
import hospitalModel from "../Models/Hospital.Model";
import specialityModel from "../Models/Speciality.Model";
import { errorResponse, successResponse } from "../Services/response";
import * as jwt from "jsonwebtoken";

export const getAllHospitalsList = async (req: Request, res: Response) => {
  try {
    const hospitalList = await hospitalModel.find();
    return successResponse(hospitalList, "Successfully fetched Hospital's list", res);
  } catch (error: any) {
    return errorResponse(error, res);
  }
};
//create a hospital
export const createHospital = async (req: Request, res: Response) => {
  try {
   let body=req.body;
  //  let anemityObj=await new anemityModel(body).save();
  //  let specialisedObj=await new specialityModel(body).save();
   let hospitalObj= await new hospitalModel(body).save();
   (err: any, token: any)=>{
    if(err) return errorResponse(err,res);
    return successResponse(token,"Hospital created successfully", res);
   }
  }
    catch (error: any) {
    return errorResponse(error, res);
  }
};


export const createHospitalAnemity = async(req: Request, res:Response)=>{
  try{
    let body=req.body;
    let anemityObj=await new anemityModel(body).save();
    jwt.sign(
      anemityObj.toJSON(),
      process.env.SECRET_HOSPITAL_KEY as string,(err:any, token:any)=>{
        if(err) return errorResponse(err,res);
        return successResponse(token, "Address has been successfully added",res);

      }

    )
  }
  catch(error: any){
    return errorResponse(error, res);
  }
};
