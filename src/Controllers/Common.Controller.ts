import { Request, Response } from "express";
import { setProfileImage } from "../Services/Common/Common.Service";
import { errorResponse, successResponse } from "../Services/response";

export const SetProfileImage = async (req: Request, res: Response) => {
    try {
        const { userId, profileImageUrl, uploadFor } = req.body;
        const result = await setProfileImage(userId, profileImageUrl, uploadFor)
        return successResponse(result, "Success", res);
    } catch (error: unknown) {
        return errorResponse(error, res)
    }
}