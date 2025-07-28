import { NextFunction, Request, Response } from "express";
import { Brand } from "../models/brand.model";
import CustomError from "../middlewares/error-handler.middleware";
import { deleteFiles, uploadFile } from "../utils/cloudinary-service.utils";

const folder_name = '/brands'
//* brand registration

export const registerBrand = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {name,description} = req.body;
    console.log(req.file);
    const logo = req.file as Express.Multer.File

    if (!name) {
      throw new CustomError("brand name is required !", 400);
    }
//Revist this part again: {From here}
    const brand = new Brand({name,description})

    const {path,public_id} = await uploadFile(logo.path,folder_name)

    brand.logo = {
      path,
      public_id
    }

    await brand.save()
//{To here ^}
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

    //getting the brand first
    const brand = await Brand.findById(id);

    //and now deleting it by deleting image first and then the actual brand.
    if(!brand){
      throw new CustomError(`Brand not found`,404)
    }

    if(brand.logo){
      await deleteFiles([brand.logo.public_id])
    }

    await brand.deleteOne()

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

//update brand by Id
export const updateBrand = async(req:Request,res:Response,next:NextFunction)=>{
  try{
      const id = req.params.id;
      const {name,description} = req.body
      const logo = req.file as Express.Multer.File

      const brand = await Brand.findById(id)

      if (!brand) {
        throw new CustomError(`Brand not found`,404)
      }

      if(name) brand.name = name
      if(description) brand.description = description

      if(logo){
        const {path,public_id} = await uploadFile(logo.path,folder_name)

        //deleting old image
        if(brand.logo) {
          await deleteFiles([brand.logo?.public_id])
        }
        //update new image
        brand.logo = {
          path,
          public_id}
      }

      await brand.save()

      res.status(200).json({
        message: "brand updated",
        status: "Success",
        success: true,
        data: brand,
      });
  }catch(err){
    next(err)
  }}