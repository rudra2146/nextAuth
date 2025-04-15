import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

type EmailType = "VERIFY" | "RESET";

interface SendMailParams {
  email: string;
  emailType: EmailType;
  userId: string;
}

export const sendMail = async ({ email, emailType, userId }: SendMailParams) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d088f1be053e79",
        pass: "a1a477ba72a6d3",
      },
    });

    const mailOptions = {
      from: "viralpandya079@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>
          Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a> 
          to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.
          <br />
          Or copy and paste this link in your browser:
          <br />
          ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
