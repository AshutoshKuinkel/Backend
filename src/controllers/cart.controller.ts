import { Cart } from "../models/cart.model";
import {Request,Response,NextFunction} from "express";
import CustomError from "../middlewares/error-handler.middleware";

//we need CRUD model for Cart: register/add product to cart, get users cart items, update product quantity, remove select product from cart, remove all product from cart.

export const addProductToCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {productId} = req.body
    const quantity = Number(req.body.quantity)
    const userId = req.user._id

    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
  throw new CustomError("Quantity must be a positive integer", 400);
  }

    if(!productId){
      throw new CustomError(`Product ID is required`,400)
    }

    //Checking if the product is in cart for user first:
     let cartItem = await Cart.findOne({ user: userId, product: productId });

     //if the product is in cart: update the quantity, else create item:
     if(cartItem){
      cartItem.quantity += quantity
      await cartItem.save()
     }else{
      cartItem = await Cart.create({
      product: productId,
      user: userId,
      quantity: quantity
    });
     }

    const fetchCart = await Cart.find({user: userId}).populate("product");

    const totalAmount = fetchCart.reduce((total:number, item:any) => total + (item.product.price * item.quantity), 0);
    res.status(201).json({
      message: "Product added to cart successfully",
      status: "success",
      success: true,
      data: cartItem,totalAmount
    });
  }catch(err){
    next(err)
  }
}

export const getUserCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const userId = req.user._id;
    
    const cartItems = await Cart.find({ user: userId }).populate("product")

    //make sure we are calculating the total amount and returning it to the user for this function.
    const totalAmount = cartItems.reduce((total:number, item:any) => total + (item.product.price * item.quantity), 0);


    res.status(200).json({
      message: "Cart items retrieved successfully",
      status: "success",
      success: true,
      data: cartItems,totalAmount
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

    const fetchUpdatedCart = await Cart.find({user: userId}).populate("product")

    const totalAmount = fetchUpdatedCart.reduce((total:number, item:any) => total + (item.product.price * item.quantity), 0);

    res.status(200).json({
      message: "Cart item updated successfully",
      status: "success",
      success: true,
      data: cartItem,totalAmount
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

    const fetchUpdatedCart = await Cart.find({user: userId}).populate("product")

    const totalAmount = fetchUpdatedCart.reduce((total:number, item:any) => total + (item.product.price * item.quantity), 0);

    res.status(200).json({
      message: "Cart item removed successfully",
      status: "success",
      success: true,
      data: cartItem,totalAmount
    });
  }catch(err){
    next(err)
  }
}

export const clearCart  = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const userId = req.user._id;

    const cartItems = await Cart.deleteMany({ user: userId });

    const fetchUpdatedCart = await Cart.find({user: userId}).populate("product")

    const totalAmount = fetchUpdatedCart.reduce((total:number, item:any) => total + (item.product.price * item.quantity), 0);

    res.status(200).json({
      message: "Cart cleared successfully",
      status: "success",
      success: true,
      data: cartItems,totalAmount
    });
  }catch(err){
    next(err)
  }
}