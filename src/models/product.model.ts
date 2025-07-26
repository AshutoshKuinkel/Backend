import mongoose from "mongoose";
//add cover image {required} and images {optional} to the product model and then after that, make sure we use multer
//and cloudinary to take in those images and save it both locally and to the cloud.

const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'name is required'],
    trim:true
  },
  brand:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Brand',
    required:[true,'brand is required']
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:[true,'brand is required']
  },
  coverImage:{
    type:String,
    require:true
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true,'createdBy required']
  },
  images:{
    type:[String]
  },
  isFeatured:{
    type:Boolean,
    default:false,
  },
  stock:{
    type:Number,
    default:0
  },
  price:{
    type:Number,
    required:[true,`price is required`],
    min:[0,'price must be positive']
  },
  description:{
    type:String,
  },
  size:{
    type:String
  }
},{timestamps:true})

export const Product = mongoose.model('Product',productSchema)