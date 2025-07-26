import cloudinary from "../config/cloudinary.config";
import CustomError from "../middlewares/error-handler.middleware";
import fs from "fs";

export const uploadFile = async(path:string,dir='/') =>{
  try{
    const {public_id,secure_url} = await cloudinary.uploader.upload(path,{
      unique_filename:true,
      folder:'MERN_CLASS_PROJECT' + dir,
      // allowed_formats:[]
    })

    //delete image from uploads
    if(fs.existsSync(path)){
      fs.unlinkSync(path)
    }

    return{
      public_id,
      path:secure_url
    }
  }catch(err){
    console.error('Cloudinary upload error',err)
    throw new CustomError(`Error uploading file.`,500)
  }
}