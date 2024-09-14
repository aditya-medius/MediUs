import hospitalModel from "../../../Models/Hospital.Model"
import { Hospital } from "../../Helpers"
import { formatHospital } from "../Hospital.Util"

export const getHospitalDetailsById = async (hospitalId: string): Promise<Hospital> => {
    const hospital = await hospitalModel.findOne({ _id: hospitalId })
    return formatHospital(hospital);
}

export const updateHospitalById = async (hospitalId: string, updateQuery: object): Promise<boolean> => {
    await hospitalModel.findOneAndUpdate({ _id: hospitalId }, updateQuery)
    return Promise.resolve(true)
}