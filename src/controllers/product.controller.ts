import { uploadFile } from './../utils/cloudinary-service.utils';
import { NextFunction, Request, Response } from "express";
import CustomError from "../middlewares/error-handler.middleware";
import { Product } from "../models/product.model";
import { Brand } from "../models/brand.model";
import { Category } from "../models/category.model";
import mongoose from "mongoose";

const folder_name = '/products'
//* Product registration

export const registerProduct = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {name,brand,category,isFeatured,stock,price,description,size} = req.body;
    const createdBy = req.user._id
    
      const files = req.files as {
      coverImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };

    const coverImage = files?.coverImage?.[0];
    const images = files?.images || [];   

    if (!name||!brand||!category||!price) {
      throw new CustomError("Please fill out at least the name,brand,category and price!", 400);
    }

    if (!coverImage) {
      throw new CustomError("Cover image is required", 400);
    }
    
    //This is perfectly fine aswell:
    // const product = await Product.create(name,brand,category,createdBy,isFeatured,stock,price,description,size)
    //but the method below is better in terms of error handling

    if(!brand){
      throw new CustomError(`Brand is required`,400)
    }
    if(!category){
      throw new CustomError(`Category is required`,400)
    }
    // if(!createdBy){
    //   throw new CustomError(`createdBy is required`,400)
    // }
    const product = new Product({
      name,isFeatured,stock,price,description,size
    })

    
    const { path: coverPath, public_id: coverPublicId } = await uploadFile(
      coverImage.path,
      "/uploads"
    );
    product.coverImage = coverPath;

    
    if (images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((img) => uploadFile(img.path, "/uploads"))
      );
      product.images = uploadedImages.map((img) => img.path);
    }

    const productBrand = await Brand.findById(brand)

    if(!productBrand){
      throw new CustomError(`Brand not found`,400)
    }

    const productCategory = await Category.findById(category)

    if(!productCategory){
      throw new CustomError(`productCategory not found`,400)
    }
    product.brand = productBrand._id
    product.category = productCategory._id
    product.createdBy = new mongoose.Types.ObjectId(createdBy.toString());

    await product.save()

    res.status(201).json({
      message: "Product registration successfull",
      status: "success",
      success: true,
      data: product,
    });
  }catch(err){
  next(err)
}
}

//get all products

export const getAllProduct = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const product = await Product.find()

    res.status(200).json({
      message: "Products fetched",
      status: "success",
      success: true,
      data: product,
  })
  }catch(err){
    next(err)
  }
}

//get individual product by ID

export const getProductById = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {id} = req.params
    const product = await Product.findById(id)

    res.status(200).json({
      message: "Product fetched successfully",
      status: "success",
      success: true,
      data: product,
  })
  }catch(err){
    next(err)
  }
}

//update individual product 

export const updateProduct = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const id = req.params.id
    const {name,brand,category,createdBy,isFeatured,stock,price,description,size} = req.body

     if (!name||!brand||!category||!price) {
      throw new CustomError("Please fill out at least the name,brand,category and price!", 400);
    }

    const product = await Product.findByIdAndUpdate(id,{name,brand,category,createdBy,isFeatured,stock,price,description,size},{new:true,reValidate:true})

    res.status(200).json({
      message: "Product successfully updated",
      status: "success",
      success: true,
      data: product,
  })
  }catch(err){
    next(err)
  }
}

//remove product

export const removeProduct = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  res.status(200).json({
    message: "Product removed",
    status: "Success",
    success: true,
    data: product,
  });
  }catch(err){
    next(err)
  }
}

//get product by category

//get product by brand