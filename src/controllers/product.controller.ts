import { deleteFiles, uploadFile } from './../utils/cloudinary-service.utils';
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
    
    
      const files = req.files as {
      coverImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };

    const createdBy = req.user._id
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
      `/${folder_name}`
    );
    product.coverImage = {
      path:coverPath,
      public_id: coverPublicId
    }

    
    if (images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((img) => uploadFile(img.path, `/${folder_name}`))
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
    const {currentPage,perPage} = req.query
    let filter = {}
    
    const page = Number(currentPage) || 1
    const limit = Number(perPage) || 10
    const skip = (page -1) * limit

    const product = await Product.find(filter)
    .limit(limit)
    .skip(skip)
    .populate('brand')
    .populate('category')
    .populate("createdBy")

    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total/limit)
    const nextPage = totalPages > page ? page + 1 : null
    const prevPage = 1 > page ? page - 1 : null
    const hasNextPage = totalPages > page ? true : false
    const hasPrevPage = 1 > page ? true : false

    res.status(200).json({
      message: "Products fetched",
      status: "success",
      success: true,
      data: product,
      pagination:{
        total,
        totalPages,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage
      }
  })
  }catch(err){
    next(err)
  }
}

//get individual product by ID

export const getProductById = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {id} = req.params
    const product = await Product.findById(id).populate('brand').populate('category').populate('createdBy')

    if(!product){
      throw new CustomError(`Product not found.`,404)
    }

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
    const {name,brand,category,isFeatured,stock,price,description,size,deletedImage} = req.body
    const createdBy = req.user._id

    const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  let deletedImages: string[] = [];
  if (deletedImage) {
    deletedImages = JSON.parse(deletedImage);
  }

     if (!name||!brand||!category||!price) {
      throw new CustomError("Please fill out at least the name,brand,category and price!", 400);
    }

    const product = await Product.findByIdAndUpdate(id,{name,brand,category,createdBy,isFeatured,stock,price,description,size},{new:true,reValidate:true})
    if(!product){
      throw new CustomError(`Product not found`,400)
    }

    if (brand) {
      const brandToUpdate = await Brand.findById(brand);
      if (!brandToUpdate) {
        throw new CustomError("Brand not found", 400);
    }
      product.brand = brandToUpdate._id;
  }

    if (category) {
      const categoryToUpdate = await Category.findById(category);
      if (!categoryToUpdate) {
        throw new CustomError("Category not found", 400);
      }
      product.category = categoryToUpdate._id;
  }
    if (cover_image) {
      const { path, public_id } = await uploadFile(
        cover_image[0].path,
        folder_name
      );
    if (product.coverImage) {
      await deleteFiles([product.coverImage.public_id]);
    }
    product.coverImage = {
      path,
      public_id,
    };
  }

  // ! id old images are deleted
  if (
    Array.isArray(deletedImages) &&
    deletedImages.length > 0
  ) {
    await deleteFiles(deletedImages);
    const filteredImages =
      product.images.length > 0
        ? product.images.filter(
            (image) => !deletedImages.includes(image)
          )
        : [];
    product.set("images", filteredImages);
  }

  // ! if new images uploaded

  if (images && images.length > 0) {
    const newImages = await Promise.all(
      images.map(async (image) => await uploadFile(image.path, folder_name))
    );
    product.set("images", [...product.images, ...newImages]);
  }

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

  const product = await Product.findById(id);

  if(!product){
    throw new CustomError(`Product not found`,404)
  }

  if(product.images && product.images.length > 0){
    await deleteFiles(product.images.map((img:any) => img.public_id) ?? [])
  }

  if(product.coverImage){
    deleteFiles([product.coverImage?.public_id])
  }

  await product.deleteOne()

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

export const getProductByCategory = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      throw new CustomError(`Category not found`, 404);
    }
    const products = await Product.find({ category: id }).populate('brand').populate('category').populate('createdBy')

    if (!products || products.length === 0) {
      throw new CustomError(`No products found for this category`, 404);
    }
    
    res.status(200).json({
      message: `Products from category fetched successfully`,
      status: "success",
      success: true,
      data: products,
    });
  }catch(err){
    next(err)
  }
}

//get product by brand
export const getProductByBrand = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { id } = req.params;

    const brand = await Brand.findById(id);
     if (!brand) {
      throw new CustomError(`Brand not found`, 404);
    }

    const products = await Product.find({ brand: id }).populate('brand').populate('category').populate('createdBy')

    if (!products || products.length === 0) {
      throw new CustomError(`No products found for this brand`, 404);
    }

    console.log("req.body.brand:", brand);
    
    res.status(200).json({
      message: `Products from brand fetched successfully`,
      status: "success",
      success: true,
      data: products,
    });
  }catch(err){
    next(err)
  }
}

//get featured products
export const getFeaturedProducts = async(req:Request,res:Response,next:NextFunction)=>{
  try{

    const products = await Product.find({ isFeatured:true}).populate('brand').populate('category').populate('createdBy')

    if (!products || products.length === 0) {
      throw new CustomError(`No featured products`, 404);
    }
    
    res.status(200).json({
      message: `Featured products fetched successfully`,
      status: "success",
      success: true,
      data: products,
    });
  }catch(err){
    next(err)
  }
}