import nodemailer from 'nodemailer';




export const smtpTransport = nodemailer.createTransport('SMTP',{
        service:'Gmail',
        auth:{
            XOAuth2:{
                user:userSession.user,
                clientId:process.env.GOOGLE_CLIENT_ID,
                clientSecret:process.env.GOOGLE_CLIENT_SECRET,
                refreshToken:userSession.refresh_token,
                accessToken:userSession.access_token
            }
        }
    })