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

description:{
    type: String,
  },
})

export const Brand = mongoose.model("Brand",brandSchema)