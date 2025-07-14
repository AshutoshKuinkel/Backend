import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
//register 

export const register = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {firstName,lastName,email,password,phone} = req.body;
    const user = await User.create({firstName,lastName,email,password,phone});
    res.status(201).json({
      message: 'User registered successfully',
      status: 'success',
      success: true,
      data: user
    });
  }
  catch(err){
    next(err);
  }

}

//login

//forgot password
//change password