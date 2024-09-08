import { Request } from "express";
import doctorModel from "../../Models/Doctors.Model";
import hospitalModel from "../../Models/Hospital.Model";
import patientModel from "../../Models/Patient.Model";

export const setProfileImage = async (id: string, profileImageUrl: string, uploadfor: string) => {
    try {
        let userModel, upateQuery;
        switch (uploadfor) {
            case "doctor": {
                userModel = doctorModel
                upateQuery = { $set: { profileImage: profileImageUrl } }
                break;
            }
            case "hospital": {
                userModel = hospitalModel
                upateQuery = { $set: { profileImage: profileImageUrl } }
                break;
            }
            case "patient": {
                userModel = patientModel
                upateQuery = { $set: { profileImage: profileImageUrl } }
                break;
            }
        }
        await userModel?.findOneAndUpdate({ _id: id }, upateQuery)
        return Promise.resolve(true)
    } catch (error: unknown) {
        return Promise.reject(error)
    }
}