import express from "express";
import mongoose from "mongoose";
import {Request,Response,NextFunction} from "express";

const brandSchema = new mongoose.Schema({
name: {
    type: String,
    required: [true, "Brand_name is required !"],
    trim: true,
    unique: true,
    maxLength: 50,
  },
logo:{
  path:{
    type:String,
    required:true
  },
  public_id:{
    type:String,
    required:true
  }
},
description:{
    type: String,
  },
})

<<<<<<< HEAD
//exporting
export const Brand = mongoose.model("Brand",brandSchema)
=======
export const Brand = mongoose.model("Brand",brandSchema)
>>>>>>> master
