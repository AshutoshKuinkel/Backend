import mongoose from "mongoose";

export const ConnectDatabase = (uri:string) => {
  mongoose.connect(uri, {})
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });
  };