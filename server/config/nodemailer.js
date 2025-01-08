import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { SMTP_USER, SMTP_PASS, APP_PASSWORD, SENDER_EMAIL } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp@gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: SENDER_EMAIL,
    pass: APP_PASSWORD,
  },
});

export default transporter;
