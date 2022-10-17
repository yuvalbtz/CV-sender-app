// import {smtpTransport} from '../../utility/smtpTransporter'
import nodemailer from 'nodemailer';
import xoauth2 from 'xoauth2'
import smtpTransport from 'nodemailer-smtp-transport';
export default async function handler(req, res){
   
   const {to, message, jobMailInfo, session} = JSON.parse(req.body)
   
   
    try {
        
        const mailer = nodemailer.createTransport(smtpTransport({
            host: "smtp.gmail.com",
            service:'Gmail',
            port: 465,
            secure: true,
            auth:{
                // xoauth2:xoauth2.createXOAuth2Generator({
                //     user:session.user.email,
                //     clientId:process.env.GOOGLE_CLIENT_ID,
                //     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
                //     refreshToken:session.refresh_token,
                //     accessToken:session.access_token
                // })
                //  type: "OAuth2",
                 user:session.user.email,
                // clientId:process.env.GOOGLE_CLIENT_ID,
                // clientSecret:process.env.GOOGLE_CLIENT_SECRET,
                // refreshToken:session.refresh_token,
                // accessToken:session.access_token,
                // expires: 1484314697598
                 pass:process.env.APP_PASS,
                

            }
        }))
        
        const res = await mailer.sendMail({
            from:session.user.email,
            to:to,
            subject:jobMailInfo.jobEmailSubject,
            text:message,
            attachments:[{   
                // encoded string as an attachment
                filename: jobMailInfo.fileName,
                path: jobMailInfo.file,
                
            }]

          })
    
          console.log(res);
          
        } catch (error) {
          if(error){
            console.log(error)
          }
        }
        return res.status(200).json({ status: 'Ok' });
} 
