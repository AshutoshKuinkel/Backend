import { Request, Response, NextFunction } from 'express';
import { Role } from './../types/enum.types';
import CustomError from './error-handler.middleware';
import { verifyToken } from '../utils/jwt.utils';
import User from '../models/user.model';


export const authenticate = (roles?:Role[])=>{

  return async(req:Request,res:Response,next:NextFunction)=>{
    try{
      //get token from cookies
      console.log(req.cookies);
      const access_token = req.cookies.access_token

      if(!access_token){
        throw new CustomError(`Unauthorised. Access denied.`,401)
      }

      //verify token
      const decodedData = verifyToken(access_token)

      if(Date.now()> decodedData.exp * 1000){
        throw new CustomError(`Session expired. Access denied.`,401)
      }

      const user = await User.findById(decodedData._id)

      if(!user){
        throw new CustomError(`Unauthorised. Access denied.`,401)
      }
      console.log(decodedData);

      //roles.includes(userRole)
      if(roles&& !roles.includes(decodedData.role)){
        throw new CustomError('Unauthorised. Access denied.',401)
      }

      req.user = {
        _id: decodedData._id,
        email: decodedData.email,
        role: decodedData.role,
        firstName: decodedData.firstName,
        lastName: decodedData.lastName
      }
      next()
    }catch(err){
      next(err)
    }
  }
}