import { Request, Response } from "express";
import bodyPartModel from "./BodyPart.Model";
import specialityBodyModel from "./SpecialityBody.Model";
import specialityModel from "./Specialization.Model";
import cityModel from "./City.Model";
import stateModel from "./State.Model";
import countryModel from "./Country.Model";
import { errorResponse, successResponse } from "../Services/response";
import LocalityModel from "./Locality.Model";
import paymentModel from "./Payment.Model";

export const addSpeciality = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const data = await new specialityModel(body).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const addBodyPart = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const data = await new bodyPartModel(body).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const addSpecialityBody = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.bodyParts = [...new Set(body.bodyParts)];
    const data = await new specialityBodyModel({
      speciality: body.speciality,
      bodyParts: body.bodyParts,
    }).save();
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

export const addToSpecialityBody = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    body.bodyParts = [...new Set(body.bodyParts)];
    const data = await specialityBodyModel.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { bodyParts: body.bodyParts } },
      { new: true }
    );
    return successResponse(data, "Successfully created data", res);
  } catch (error) {
    return errorResponse(error, res);
  }
};

//add city 
export const addCity= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let cityObj=await new cityModel(body).save();
        return successResponse(cityObj, "City has been successfully added",res);
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
        return successResponse(stateObj, "State has been successfully added",res);
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
        return successResponse(localityObj, "Locality has been successfully added",res);
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
    return successResponse(countryObj, "Country has been successfully added",res);

  }
  catch(error: any){
    return errorResponse(error, res);
  }
};

//add payment options
export const addPayment= async(req:Request, res:Response)=>{
  try{
    let body=req.body;
    let paymentObj=await new paymentModel(body).save();
    return successResponse(paymentObj, "Payment Options has been successfully added",res);

  }
  catch(error: any){
    return errorResponse(error, res);
  }
};


