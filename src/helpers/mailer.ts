import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer"


export const sendMail = async({email,emailType,userId}:any)=>
{
    
    try {
        const hashedToken = await bcrypt.hash(userId.toString(),10)
        if(emailType==='VERIFY'){
          await User.findByIdAndUpdate(userId,{verifyToken:hashedToken,verifyTokenExpiry:Date.now()+3600000})
        }
        else if(emailType==='RESET'){
          await User.findByIdAndUpdate(userId,{forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now()+3600000})
        }
        
        var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "d088f1be053e79",
            pass: "a1a477ba72a6d3"
          }
        });


          const mailOption ={
                from: 'viralpandya079@gmail.com',
                to: email,
                subject: emailType === 'VERIFY'?'Verify your email':'Reset your password',
                html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a>to ${emailType === "VERIFY"?"verify your email":"Reset your password"}
                or copy and paste the link below in your browser.
                <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                </p>
                `
            
          }
          const mailResponse = await transport.sendMail(mailOption)
          return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}