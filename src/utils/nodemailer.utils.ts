import nodemailer from "nodemailer";
import dotenv from "dotenv"
import CustomError from "../middlewares/error-handler.middleware";
dotenv.config()


//creating transporter:

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:Number(process.env.SMTP_PORT) === 465 ? true : false,
    service:process.env.SMTP_SERVICE,
    auth:{
      user:process.env.SMTP_USER,
      pass:process.env.SMTP_PASSWORD
    }
})

type mailOption = {
  to:string,
  subject:string,
  html:string,
  cc?:string | string[] | null,
  bcc?:string | string[] | null,
  attachments?:[] | null,
}

export const sendEmail = async({to,subject,html,cc=null,bcc=null,attachments=null}:mailOption) =>{
try{
  let message:Record<string,any> = {
    from:`MERN Kart <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  }

  if(cc){
    message['cc'] = cc
  }

  if(bcc){
    message['bcc'] = bcc
  }

  if(attachments){
    message['attachments'] = attachments
  }

  await transporter.sendMail(message)
}catch(err){
  throw new CustomError('Error sending email',500)
}
}