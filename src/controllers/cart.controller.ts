import { Cart } from "../models/cart.model";
import {Request,Response,NextFunction} from "express";
import CustomError from "../middlewares/error-handler.middleware";

//we need CRUD model for Cart: register/add product to cart, get users cart items, update product quantity, remove select product from cart, remove all product from cart.

export const addProductToCart  = async(req:Request,res:Response,next:NextFunction)=>{
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

export const getUserCart  = async(req:Request,res:Response,next:NextFunction)=>{
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

export const updateCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity <= 0) {
      throw new CustomError("Quantity must be greater than zero", 400);
    }

    const cartItem = await Cart.findOneAndUpdate(
      { _id: productId, user: userId },
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      throw new CustomError("Cart item not found", 404);
    }

    res.status(200).json({
      message: "Cart item updated successfully",
      status: "success",
      success: true,
      data: cartItem,
    });
  }catch(err){
    next(err)
  }
}

export const removeProductFromCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const { productId } = req.params;
    const userId = req.user._id;

    const cartItem = await Cart.findOneAndDelete({ _id: productId, user: userId });

    if (!cartItem) {
      throw new CustomError("Cart item not found", 404);
    }

    res.status(200).json({
      message: "Cart item removed successfully",
      status: "success",
      success: true,
      data: cartItem,
    });
  }catch(err){
    next(err)
  }
}

export const clearCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const userId = req.user._id;

    const cartItems = await Cart.deleteMany({ user: userId });

    res.status(200).json({
      message: "Cart cleared successfully",
      status: "success",
      success: true,
      data: cartItems,
    });
  }catch(err){
    next(err)
  }
}