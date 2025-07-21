import { Role } from './enum.types';
import mongoose from "mongoose";

export interface IJWTPayload{
  _id:mongoose.Schema.Types.ObjectId,
  email:string,
  role:Role,
  firstName:string,
  lastName:string
}