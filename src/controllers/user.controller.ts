import { Request,Response,NextFunction } from "express"
import User from "../models/user.model"

// get all users
export const getAll = async(req:Request,res:Response,next:NextFunction)=>{
  try{

    const users = await User.find({})

    res.status(200).json({
      message: `Users fetched`,
      success: true,
      status: "success",
      data:users
    }
    )
  }catch(err){
    err
  }
}
//delete user
//work on this tomorrow

//update profile

//get user by id

export const getUserById = async(req:Request,res:Response,next:NextFunction)=>{
  try{

    const users = await User.findById({})

    res.status(200).json({
      message: `User fetched`,
      success: true,
      status: "success",
      data:users
    }
    )
  }catch(err){
    err
  }
}
