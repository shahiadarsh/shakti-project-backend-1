import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    // 1. Create a transporter object using SMTP transport
    // We are using Mailtrap for development. You can replace with Gmail, SendGrid, etc.
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: '"Your App Name" <no-reply@yourapp.com>',
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;