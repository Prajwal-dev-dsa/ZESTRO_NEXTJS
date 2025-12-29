import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"Zestro" <${process.env.USER_EMAIL}>`, // sender address
    to: to, // list of recipients
    subject: subject, // subject line
    html: html, // HTML body
  });
};
