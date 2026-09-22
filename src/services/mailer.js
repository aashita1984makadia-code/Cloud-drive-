const nodemailer=require("nodemailer");
let transporter=null;
if(process.env.SMTP_HOST) transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}});
exports.send=async(to,subject,text)=>{if(!transporter){console.log("[mail disabled]",to,subject,text);return;}return transporter.sendMail({from:process.env.SMTP_FROM,to,subject,text});};
