import { json, Request, Response } from "express";
import addressModel from "../Models/Address.Model";
import anemityModel from "../Models/Anemities.Model";
import hospitalModel from "../Models/Hospital.Model";
import specialityModel from "../Models/Speciality.Model";
import { errorResponse, successResponse } from "../Services/response";
import * as jwt from "jsonwebtoken";
import hospitalSpecialityModel from "../Models/HospitalSpeciality.Model";
import cityModel from "../Models/City.Model";
import stateModel from "../Models/State.Model";
import LocalityModel from "../Models/Locality.Model";
import countryModel from "../Models/Country.Model";

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
  //  let specialisedObj=await new specialityModel(body).save();
   let hospitalObj= await new hospitalModel(body).save();
   jwt.sign(
     hospitalObj.toJSON(),
    process.env.SECRET_HOSPITAL_KEY as string,(err:any, token:any)=>{
    if(err) return errorResponse(err,res);
    return successResponse(token,"Hospital created successfully", res);
   });
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

export const addHospitalSpeciality= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let specialityObj=await new hospitalSpecialityModel(body).save();
    jwt.sign(
      specialityObj.toJSON(),
      process.env.SECRET_HOSPITAL_KEY as string,(err:any, token:any)=>{
        if(err) return errorResponse(err,res);
        return successResponse(token, "Speciality has been successfully added",res);
      }
    )
  }
  catch(error: any){
    return errorResponse(error, res);
  }
};

//add city 
export const addCity= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let cityObj=await new cityModel(body).save();
    jwt.sign(
      cityObj.toJSON(),
      process.env.SECRET_HOSPITAL_KEY as string,(err:any, token:any)=>{
        if(err) return errorResponse(err,res);
        return successResponse(token, "City has been successfully added",res);
      }
    )
  }
  catch(error: any){
    return errorResponse(error, res);
  }
};
//add state 
export const addState= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let stateObj=await new stateModel(body).save();
    jwt.sign(
      stateObj.toJSON(),
      process.env.SECRET_HOSPITAL_KEY as string,(err:any, token:any)=>{
        if(err) return errorResponse(err,res);
        return successResponse(token, "State has been successfully added",res);
      }
    )
  }
  catch(error: any){
    return errorResponse(error, res);
  }
};
//add locality
export const addLocality= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let localityObj=await new LocalityModel(body).save();
    jwt.sign(
      localityObj.toJSON(),
      process.env.SECRET_HOSPITAL_KEY as string,(err:any, token:any)=>{
        if(err) return errorResponse(err,res);
        return successResponse(token, "Locality has been successfully added",res);
      }
    )
  }
  catch(error: any){
    return errorResponse(error, res);
  }
};
//add country
export const addCountry= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let countryObj=await new countryModel(body).save();
    jwt.sign(
      countryObj.toJSON(),
      process.env.SECRET_HOSPITAL_KEY as string,(err:any, token:any)=>{
        if(err) return errorResponse(err,res);
        return successResponse(token, "Country has been successfully added",res);
      }
    )
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
    jwt.sign(
      addressObj.toJSON(),
      process.env.SECRET_HOSPITAL_KEY as string,(err:any, token:any)=>{
        if(err) return errorResponse(err,res);
        return successResponse(token, "Addresss has been successfully added",res);
      }
    )
  }
  catch(error: any){
    return errorResponse(error, res);
  }
};
