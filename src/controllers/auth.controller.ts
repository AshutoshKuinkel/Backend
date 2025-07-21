import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import CustomError from '../middlewares/error-handler.middleware';
import { hashPassword,compareHash } from '../utils/bcrypt.utils';
import { compare } from 'bcryptjs';
import { generateToken } from '../utils/jwt.utils';
import { IJWTPayload } from '../types/global.types';
import dotenv from "dotenv"
dotenv.config()


//register 
export const register = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {firstName,lastName,email,password,phone} = req.body;

    if(!password){
      throw new CustomError(`password is required`,400)
    }

    const user:any = await User.create({firstName,lastName,email,password,phone});

    const hashedPassword = await hashPassword(password)

    user.password = hashedPassword

    await user.save()

    const {password:pass,...newUser} = user._doc

    res.status(201).json({
      message: 'User registered successfully',
      status: 'success',
      success: true,
      data: newUser
    });
  }
  catch(err){
    next(err);
  }
}

//login

export const login = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    //1. email password validation
    const {email,password} = req.body;

    if(!email || !password){
      throw new CustomError('Email and password are required', 400);
    }

    //2. find user by email
    const user:any = await User.findOne({email}).select("+password");
    if(!user){
      throw new CustomError('Invalid Credentials', 400);
    }
    
    //3. check if password matches (user.password === pass)
    const isPassMatch = await compareHash(password,user.password)

    if (!isPassMatch){
      throw new CustomError('Invalid Credentials', 400);
    }

    const payload:IJWTPayload = {
      _id:user._id,
      role:user.role,
      email:user.email,
      firstName:user.firstName,
      lastName:user.lastName
    }
    //generate jwt token
    const access_token = generateToken(payload)

    const {password:pass,...loggedInUser} = user._doc

    res.cookie('access_token',access_token,{
      secure:process.env.NODE_ENV === 'development' ? false:true,
      httpOnly:true,
      maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 60 * 1000
    }).status(200).json({
      message: 'Login successful',
      status: 'success',
      success: true,
      data: {
        data:loggedInUser,
        access_token
      }
    });
  } catch(err){
    next(err);
  }
}

//forgot password

export const forgotPassword = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {email} = req.body
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({
        message: 'User not found',
        status: 'fail',
        success: false,
        data: null
      });
    }
    res.status(200).json({
      message: 'Password reset link sent to your email',
      status: 'success',
      success: true,
      data: null
    });
  } catch(err){
    next(err)
  }
}

//change password 1
// This is another version of the changePassword controller.
// export const changePassword = async(req:Request,res:Response,next:NextFunction)=>{
//   try{
//     const {email,oldPassword,newPassword} = req.body;
//     const user = await User.findOne({email, password: oldPassword});
//     if(!user){
//       return res.status(401).json({
//         message: 'Invalid email or old password',
//         status: 'fail',
//         success: false,
//         data: null
//       });
//     }
//     user.password = newPassword;
//     await user.save();
//     res.status(200).json({
//       message: 'Password changed successfully',
//       status: 'success',
//       success: true,
//       data: null
//     });
//   } catch(err){
//     next(err);
//   }
// }

//change password 2
export const changePassword = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {email,oldPassword,newPassword} = req.body;
    if(!newPassword || !oldPassword || !email){
      throw new CustomError("Invalid Credentials",400)
      }
    const user = await User.findOne({email}).select("+password");
    if (!user){
      throw new CustomError('Something went wrong',400)
    }
    const isPassMatched = compareHash(oldPassword,user.password)
   
    if (!isPassMatched){
      throw new CustomError(`Password does not match`,400)
    }

    user.password = await hashPassword(newPassword)

    await user.save()

    res.status(201).json({
      message: 'Password updated successfully',
      status: 'success',
      success: true,
    });
  } catch(err){
    next(err);
  }
}