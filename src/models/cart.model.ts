import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product:{
    id: mongoose.Schema.Types.ObjectId,
    ref:`Product`,
    required:true
  },

  quantity:{
    type:Number,
    default:1
  },

  user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
})

export const Cart = mongoose.model('Cart',cartSchema)