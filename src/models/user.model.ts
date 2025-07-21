import { Role } from './../types/enum.types';
// add first name,last name,email,phone,role,password to user model
import express, { Request, Response } from 'express';
import mongoose, { Schema, model } from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    minlength: [5, 'Email must be at least 5 characters long'],
  },
  phone: {
    type: String,
    max: [15, 'Phone number must be at most 15 characters long'],
  },
  role: {
    type: String,
    enum:Object.values(Role),
    default:Role.USER,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'Password must be at least 5 characters long'],
    select: false
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;