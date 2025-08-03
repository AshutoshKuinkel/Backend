import mongoose from "mongoose";
import { orderStatus, paymentMethod } from "../types/enum.types";

const orderSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:[true,`user is required`]
  },

  items:[{
    product:{
      type:mongoose.Schema.Types.ObjectId,
      ref:`product`,
      required:[true,`Product is required.`],
    },
    quantity:{
      type:Number,
      required:[true,`Please select item quantity.`]
    },
    totalPrice:{
      type:Number,
      required:[true,`Total price is required`]
    },
  }],
  totalAmount:{
    type:Number,
    required:[true,`Total Amount is required.`]
  },

  shippingAddress:{
    country:{
      type:String,
      trim:true,
      required:[true,`Please enter Country.`]
    },
    state:{
      type:String,
      trim:true,
      required:[true,`Please enter state.`]
    },
    suburb:{
      type:String,
      trim:true,
      required:[true,`Please enter suburb`]
    },
    street:{
      type:String,
      trim:true,
      required:[true,`Please enter suburb`]
    },
  },

  status:{
    type:String,
    enum:Object.values(orderStatus),
    default:orderStatus.PENDING
  },
  paymentMethod:{
    type:String,
    enum:Object.values(paymentMethod),
    default:paymentMethod.COD
  }
},{timestamps:true})

export const Order = mongoose.model('Order',orderSchema)