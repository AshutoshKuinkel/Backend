import express from "express";
import mongoose from "mongoose";
import {Request,Response,NextFunction} from "express";

const categorySchema = new mongoose.Schema({
name: {
    type: String,
    required: [true, "Category name is required !"],
    trim: true,
    unique: true,
    maxLength: 50,
  },

description:{
    type: String,
  },
})

export const Category = mongoose.model("Category",categorySchema)