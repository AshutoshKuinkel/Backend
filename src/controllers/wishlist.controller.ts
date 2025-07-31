import { getAll } from './user.controller';
//wishlist //try this one before coming in tomorrow {30/7/25}
//register product to wishlist, remove product from wishlist, get all wishlist items, checkifproduct is in wishlist
import express from "express";
import CustomError from "../middlewares/error-handler.middleware";
import { errorHandler } from "../middlewares/error-handler.middleware";
import {Request,Response,NextFunction} from "express";
import { Wishlist } from "../models/wishlist.model";

export const registerProductToWishlist = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      throw new CustomError("Product ID is required", 400);
    }
    const wishlistItem = await Wishlist.create({
      product: productId,
      user: userId
    });

    res.status(201).json({
      message: "Product added to wishlist successfully",
      status: "success",
      success: true,
      data: wishlistItem,
    });
  }catch(err){
    next(err)
  }
}

export const removeProductFromWishlist = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { id } = req.params;
    const userId = req.user._id;

    const wishlistItem = await Wishlist.findOneAndDelete({ _id: id, user: userId });

    if (!wishlistItem) {
      throw new CustomError("Wishlist item not found", 404);
    }

    res.status(200).json({
      message: "Product removed from wishlist successfully",
      status: "success",
      success: true,
      data: wishlistItem,
    });
  }catch(err){
    next(err)
  }
}

export const getAllWishlistItems = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const userId = req.user._id;

    const wishlistItems = await Wishlist.find({ user: userId }).populate("product");

    if(!wishlistItems){
      throw new CustomError(`No products in wishlist yet.`,400)
    }

    res.status(200).json({
      message: "Wishlist items retrieved successfully",
      status: "success",
      success: true,
      data: wishlistItems,
    });
  }catch(err){
    next(err)
  }
}

export const checkIfProductInWishlist = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { productId } = req.params;
    const userId = req.user._id;

    const wishlistItem = await Wishlist.findOne({ product: productId, user: userId });

    if (!wishlistItem) {
      res.status(404).json({
        message: "Product not found in wishlist",
        status: "fail",
        success: false,
      });
      return;
    }

    res.status(200).json({
      message: "Product is in wishlist",
      status: "success",
      success: true,
      data: wishlistItem,
    });
  }catch(err){
    next(err)
  }
}

export const clearWishlist = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const userId = req.user._id;

    await Wishlist.deleteMany({ user: userId });

    res.status(200).json({
      message: "Wishlist cleared successfully",
      status: "success",
      success: true,
    });
  }catch(err){
    next(err)
  }
}