import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  product: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:true
  },

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },

  createdOn: {
    type:Date,
    default: Date.now()
  }
})

// Prevent same product added twice by same user
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist',wishlistSchema)