import multer from 'multer';
import fs from "fs";

export const uploader = ()=>{

  const fileSize = 5 * 1024 * 1024

  const myStorage = multer.diskStorage({
    destination:(req,file,cb)=>{

      const uploadPath = 'uploads/'
      if(!fs.existsSync){
        fs.mkdirSync(uploadPath,{recursive:true})
      }

      cb(null,uploadPath)
    },

    filename:(req,file,cb)=>{

      //file.jpg
      const uniqueName = Date.now() +'-'+ file.originalname
      cb(null,file.originalname)
    }
  })

  const upload = multer({storage:myStorage,limits:{fileSize}})
  return upload
}