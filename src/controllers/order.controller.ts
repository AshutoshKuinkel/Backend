import { Order } from "../models/order.model";
import {Request,Response,NextFunction} from "express";
import CustomError from "../middlewares/error-handler.middleware";
import { Product } from "../models/product.model";
import { orderStatus } from "../types/enum.types";
import { Cart } from "../models/cart.model";
import { sendEmail } from "../utils/nodemailer.utils";
import User from "../models/user.model";



//create an order {preparding order with price}
export const createOrder = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {items,shippingAddress} = req.body
    console.log(req.body);
    const user = req.user._id
    const userEmail = req.user.email


    if(!items){
      throw new CustomError(`Items are required`,400)
    }
    if(!shippingAddress){
      throw new CustomError(`Shipping Address is required`,400)
    }


    const address = JSON.parse(shippingAddress)
    const orderItems = JSON.parse(items)


    const order = await Promise.all(orderItems.map(async (item:{product:string,quantity:string})=>{
        const product = await Product.findById(item.product);


        if(!product){
          return null
        }


        //reducing products stock
        product.stock -= Number(item.quantity)
        await product.save()
        return{
          product:product._id,
          quantity:Number(item.quantity),
          totalPrice:Number(item.quantity) * product.price
        }
    }))


    //filter null elements
    const filteredOrderItems = order.filter((order) => order !== null)


    //calculating total amount
    const totalAmount = filteredOrderItems.reduce((acc,val)=>{


      return acc+=Number(val.totalPrice)
    },0);


    //placing order
    const newOrder = await Order.create({items:filteredOrderItems,totalAmount,shippingAddress:address,user})

    //sending email to the user to let them know their order has been placed:
    await sendEmail({
      to:`${userEmail}`,
      subject: `Confirmation of Order`,
      html:`
        <h1 style="background-color: beige; text-align: center;">Confirmation of Order!</h1>
        <br>
        <p>This is just a message to let you know your items are processing and will soon be on their way!</p>
      `,
    })

    //deleting the item of the user cart, after order has been placed:
    await Cart.findOneAndDelete({user})

    res.status(201).json({
      message:`Order successfully placed`,
      success:true,
      status:'success',
      data:newOrder
    })
  }catch(err){
    next(err)
  }
}

//get all orders (only admin)
export const getAllOrdersAdmin = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const orders = await Order.find({}).sort({createdAt:-1})

    res.status(200).json({
      message:`All orders fetched`,
      success:true,
      status:'success',
      data:orders
    })
  }catch(err){
    next(err)
  }
}

//get users current orders (only user)
export const getAllOrdersUser = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const user = req.user._id

    const orders = await Order.find({user}).sort({createdAt:-1})

    res.status(200).json({
      message:`All orders fetched`,
      success:true,
      status:'success',
      data:orders
    })
  }catch(err){
    next(err)
  }
}


//update order status (only admin)
export const updateOrderStatus = async(req:Request,res:Response,next:NextFunction)=>{
  try{

    const {status} = req.body
    const {id} = req.params
    const userEmail = req.user.email

    const orders = await Order.findByIdAndUpdate(id,{status},{new:true})

    //sending an email to the user that their order status has been updated:
    await sendEmail({
      to:`${userEmail}`,
      subject: `Order Status Updated`,
      html:`
        <h1 style="background-color: beige; text-align: center;">Order Status Updated!</h1>
        <br>
        <p>This is just a message to let you know that the status of your items have been updated.Your items are now ${status}!</p>
      `,
    })

    res.status(200).json({
      message:`Order Status updated`,
      success:true,
      status:'success',
      data:orders
    })
  }catch(err){
    next(err)
  }
}


//cancel orders (only User)

export const cancelOrder = async(req:Request,res:Response,next:NextFunction)=>{
  try{

    const {id} = req.params
    const userEmail = req.user.email

    const orders = await Order.findByIdAndUpdate(id,{status:orderStatus.CANCELED},{new:true})

    //sending email to user:
    await sendEmail({
      to:`${userEmail}`,
      subject: `Order Cancelled`,
      html:`
        <h1 style="background-color: beige; text-align: center;">Your order has been canceled!</h1>
        <br>
        <p>We're sorry to hear you are cancelling your order with us. If you require any additional support, please make sure to contact our support team.</p>
      `,
    })

    res.status(200).json({
      message:`Order canceled`,
      success:true,
      status:'success',
      data:orders
    })
  }catch(err){
    next(err)
  }
}

//delete order


//node mailer
//pagination
// filter
