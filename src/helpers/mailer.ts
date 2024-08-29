// import nodemailer from 'nodemailer';
// import User from "@/models/user";
// import bcryptjs from 'bcryptjs';
// import dotenv from "dotenv";
// dotenv.config();

// export const sendEmail = async ({ email, emailType, userId }: any) => {
//   try {
//     const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//     if (emailType === "VERIFY") {
//       await User.findByIdAndUpdate(userId, {
//         verifyToken: hashedToken,
//         verifyTokenExpiry: Date.now() + 3600000,
//       });
//     } else if (emailType === "RESET") {
//       await User.findByIdAndUpdate(userId, {
//         forgotPasswordToken: hashedToken,
//         forgotPasswordTokenExpiry: Date.now() + 3600000,
//       });
//     }

//     var transport = nodemailer.createTransport({
//       host: "sandbox.smtp.mailtrap.io",
//       port: 2525,
//       auth: {
//         user: process.env.MAILTRAP_USER!,
//         pass: process.env.MAILTRAP_PASS!,
//       },
//     });

//     const mailOptions = {
//       from: 'docio@gmail.com',
//       to: email,
//       subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
//       html: emailType === "VERIFY"
//         ? `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email
//           or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
//           </p>`
//         : `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to reset your password
//           or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
//           </p>`
//     };

//     const mailresponse = await transport.sendMail(mailOptions);
//     return mailresponse;

//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };

import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import { connect } from "@/dbConfig/neoDb";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ email, emailType, userId }: { email: string, emailType: string, userId: string }) => {
  const driver = await connect(); // Connect to AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      // Update the user node with verification token and expiry
      await session.run(
        `
        MATCH (u:User {id: $userId})
        SET u.verifyToken = $hashedToken,
            u.verifyTokenExpiry = $expiry
        `,
        {
          userId,
          hashedToken,
          expiry: (Date.now() + 3600000).toString(), // Store expiry as string
        }
      );
    } else if (emailType === "RESET") {
      // Update the user node with password reset token and expiry
      await session.run(
        `
        MATCH (u:User {id: $userId})
        SET u.forgotPasswordToken = $hashedToken,
            u.forgotPasswordTokenExpiry = $expiry
        `,
        {
          userId,
          hashedToken,
          expiry: (Date.now() + 3600000).toString(), // Store expiry as string
        }
      );
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER!,
        pass: process.env.MAILTRAP_PASS!,
      },
    });

    const mailOptions = {
      from: 'docio@gmail.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: emailType === "VERIFY"
        ? `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email
          or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
          </p>`
        : `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to reset your password
          or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
          </p>`
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;

  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    await session.close(); // Close the session
    await driver.close();  // Close the driver connection if you no longer need it
  }
};

