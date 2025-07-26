import multer from 'multer';
import fs from "fs";
import path from "path";
import CustomError from './error-handler.middleware';
import { Request } from 'express';

export const uploader = ()=>{

  const fileSize = 5 * 1024 * 1024

  const allowedExts = ['jpg','png','webp','gif','svg','jpeg']

  const myStorage = multer.diskStorage({
    destination:(req,file,cb)=>{

      const uploadPath = 'uploads/'
      if(!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath,{recursive:true})
      }

      cb(null,uploadPath)
    },

    filename:(req,file,cb)=>{

      //file.jpg
      const uniqueName = Date.now() +'-'+ file.originalname
      cb(null,uniqueName)
    }
  })

  const fileFilter = (req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    const ext = path.extname(file.originalname).replace('.','')
    if(allowedExts.includes(ext)){
      cb(null,true)
    }else{
      const err = new CustomError(`The file format ${ext} isn't allowed`,400)
      cb(err)
    }
  }

  const upload = multer({storage:myStorage,
    limits:{fileSize},
    fileFilter
  })
  return upload
}