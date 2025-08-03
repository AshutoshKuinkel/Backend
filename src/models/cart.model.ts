import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product:{
    type: mongoose.Schema.Types.ObjectId,
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

  totalAmount:{
    type:Number,
  }
})

cartSchema.index({ user: 1, product: 1 }, { unique: true });

export const Cart = mongoose.model('Cart',cartSchema)