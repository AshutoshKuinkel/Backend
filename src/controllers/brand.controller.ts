import { NextFunction, Request, Response } from "express";
import { Brand } from "../models/brand.model";
import CustomError from "../middlewares/error-handler.middleware";

//* brand registration

export const registerBrand = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {name,description} = req.body;

    if (!name) {
      throw new CustomError("brand name is required !", 400);
    }
    
    const brand = await Brand.create(name,description)
    res.status(201).json({
      message: "Brand created successfully",
      status: "success",
      success: true,
      data: brand,
    });
  }catch(err){
  next(err)
}
}

//get all brands
export const getAllBrands = async(req:Request,res:Response,next:NextFunction)=>{
  try{
  const brand = await Brand.find();

  res.status(200).json({
    message: "All brands",
    status: "Success",
    success: true,
    data: brand,
  });
  }catch(err){
  next(err)
}
}

//remove a brand
export const removeBrand = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);

  res.status(200).json({
    message: "brand removed",
    status: "Success",
    success: true,
    data: brand,
  });
  }catch(err){
    next(err)
  }
}

//get brand by ID
export const getBrandById = async(req:Request,res:Response,next:NextFunction)=>{
  try{
     const { id } = req.params;

    const brand = await Brand.findById(id);

    res.status(200).json({
      message: "brand by ID",
      status: "Success",
      success: true,
      data: brand,
    });
  }catch(err){
    next(err)
  }

}

