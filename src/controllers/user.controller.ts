import { Request,Response,NextFunction } from "express"
import User from "../models/user.model"
import CustomError from "../middlewares/error-handler.middleware"

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
    next(err)
  }
}
//delete user

export const deleteUser = async(req:Request,res:Response,next:NextFunction)=>{
try{
  const {id} = req.params
  const users = await User.findByIdAndDelete(id)

  if(!User){
    throw new CustomError('User not found',404)
  }
  
  res.status(200).json({
      message: `User deleted`,
      success: true,
      status: "success",
      data:users
    }
    )
} catch (err){
  next(err)
}
}

//get user by id

export const getById = async(req:Request,res:Response,next:NextFunction)=>{
try{
  const {id} = req.params
  const users = await User.findById(id)

  if(!User){
    throw new CustomError('User not found',404)
  }
  
  res.status(200).json({
      message: `User fetched`,
      success: true,
      status: "success",
      data:users
    }
    )
} catch (err){
  next(err)
}
}

//register user


export const registerUser = async(req:Request,res:Response,next:NextFunction)=>{
try{
  const {firstName,lastName,email,password,phone,role} = req.body
  const user = await User.create({firstName,lastName,email,password,phone,role})
  
  res.status(200).json({
      message: `User fetched`,
      success: true,
      status: "success",
      data:user
    }
    )
} catch (err){
  next(err)
}
}

//test comment for git