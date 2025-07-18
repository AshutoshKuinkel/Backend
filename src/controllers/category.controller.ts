import { Category } from './../models/category.model';
import { NextFunction, Request, Response } from "express";
import CustomError from "../middlewares/error-handler.middleware";

//* Category registration

export const registerCategory = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {name,description} = req.body;

    if (!name) {
      throw new CustomError("Category name is required !", 400);
    }
    
    const category = await Category.create(name,description)
    res.status(201).json({
      message: "Category created successfully",
      status: "success",
      success: true,
      data: category,
    });
  }catch(err){
  next(err)
}
}

//get all category
export const getAllCategory = async(req:Request,res:Response,next:NextFunction)=>{
  try{
  const category = await Category.find();

  res.status(200).json({
    message: "All Category",
    status: "Success",
    success: true,
    data: category,
  });
  }catch(err){
  next(err)
}
}

//remove a category
export const removeCategory = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  res.status(200).json({
    message: "Category removed",
    status: "Success",
    success: true,
    data: category,
  });
  }catch(err){
    next(err)
  }
}

//get category by ID
export const getCategoryById = async(req:Request,res:Response,next:NextFunction)=>{
  try{
     const { id } = req.params;

    const category = await Category.findById(id);

    res.status(200).json({
      message: "Category by ID",
      status: "Success",
      success: true,
      data: category,
    });
  }catch(err){
    next(err)
  }
}

//update category

export const updateCategory = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const id = req.params.id
    const {name,description} = req.body
    
    const category = await Category.findByIdAndUpdate(id,{name,description},{new:true,reValidate:true}) 

    res.status(200).json({
      message: "Category by ID",
      status: "Success",
      success: true,
      data: category,
    })

  }catch(err){
    next(err)
  }

}