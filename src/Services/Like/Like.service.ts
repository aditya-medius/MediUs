import { excludeDoctorFields } from "../../Controllers/Doctor.Controller";
import likeModel from "../../Models/Likes.Model";

export const likeExist = async (likedDoctordId: string, likedBy: string) => {
  try {
    let doesLikeExist = await likeModel.exists({
      doctor: likedDoctordId,
      likedBy: likedBy,
    });
    return Promise.resolve(doesLikeExist);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getDoctorsIHaveLikes = async (myId: string) => {
  try {
    let myLikes = await likeModel
      .find({
        likedBy: myId,
        $or: [
          {
            unlike: false,
          },
          {
            unlike: { $exists: false },
          },
        ],
      })
      .populate({ path: "doctor", select: excludeDoctorFields });

    return Promise.resolve(myLikes);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getLikeById = async (likedDoctordId: string, likedBy: string) => {
  try {
    return Promise.resolve(
      await likeModel.findOne({ doctor: likedDoctordId, likedBy: likedBy })
    );
  } catch (error: any) {
    return Promise.reject(error);
  }
};
