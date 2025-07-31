import { Cart } from "../models/cart.model";
import {Request,Response,NextFunction} from "express";
import CustomError from "../middlewares/error-handler.middleware";

//we need CRUD model for Cart: register/add product to cart, get users cart items, update product quantity, remove select product from cart, remove all product from cart.

const addProductToCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {productId} = req.body
    const userId = req.user._id

    if(!productId){
      throw new CustomError(`Product ID is required`,400)
    }

    const cartItems = await Cart.create({
      product: productId,
      user: userId
    });
    
    res.status(201).json({
      message: "Product added to cart successfully",
      status: "success",
      success: true,
      data: cartItems,
    });
  }catch(err){
    next(err)
  }
}

const getUserCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const userId = req.user._id;
    
    const cartItems = await Cart.find({ user: userId }).populate("product");
    
    res.status(200).json({
      message: "Wishlist items retrieved successfully",
      status: "success",
      success: true,
      data: cartItems,
    });
  }catch(err){
    next(err)
  }
}

const updateCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{

  }catch(err){
    next(err)
  }
}

const removeItemFromCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    
  }catch(err){
    next(err)
  }
}

const clearCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{

  }catch(err){
    next(err)
  }
}