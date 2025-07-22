import { Role } from './enum.types';
import mongoose from "mongoose";

export interface IJWTPayload{
  _id:mongoose.Schema.Types.ObjectId,
  email:string,
  role:Role,
  firstName:string,
  lastName:string
}

export interface IJWTDecodedPayload extends IJWTPayload {
  exp:number;
  iat:number
}

export const allAdmins = [Role.ADMIN,Role.SUPER_ADMIN]
export const onlyUser = [Role.USER]