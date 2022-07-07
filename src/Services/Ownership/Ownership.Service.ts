import { Request, Response } from "express";
import { AnyArray } from "mongoose";
import ownershipModel from "../../Models/Ownership.Model";

export const addOwnership = async (body: any) => {
  try {
    return Promise.resolve(await new ownershipModel(body).save());
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getOwnership = async () => {
  try {
    return Promise.resolve(await ownershipModel.find());
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const deleteOwnership = async (id: string) => {
  try {
    return Promise.resolve(await ownershipModel.findOneAndDelete({ _id: id }));
  } catch (error: any) {
    return Promise.reject(error);
  }
};
