import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const getHospitalToken = async (body: any) => {
  const token = await jwt.sign(body, process.env.SECRET_HOSPITAL_KEY as string);
  return token;
};
