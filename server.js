import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { errorHandler } from "./middlewares/errorMiddleware.js";
import { notFound } from "./middlewares/notFound.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import connectDatabase from "./config/database.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://furqan-life.netlify.app",
      "https://islam-frontend.vercel.app",
    ],
    credentials: true,
  }),
);

app.options(/.*/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limit
app.use(rateLimiter);

// DB connect
connectDatabase();

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const resendAPT = process.env.RESENDAPI;

    const resend = new Resend(resendAPT);

    resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.EMAILTO,
      subject: "Furqan Life",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>

        <body style="
          margin: 0;
          padding: 40px 20px;
          background-color: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
          color: #333;
        ">

          <div style="
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          ">

            <!-- Header -->
            <div style="
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              padding: 30px;
              text-align: center;
              color: white;
            ">
              <h1 style="
                margin: 0;
                font-size: 26px;
              ">
                New Contact Message
              </h1>

              <p style="
                margin: 8px 0 0;
                opacity: 0.9;
                font-size: 14px;
              ">
                You received a new message from your website
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">

              <div style="
                background: #f8fafc;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
              ">

                <p style="margin: 0 0 12px;">
                  <strong>Name</strong><br />
                  ${name}
                </p>

                <p style="margin: 0;">
                  <strong>Email</strong><br />
                  <a
                    href="mailto:${email}"
                    style="color: #6366f1; text-decoration: none;"
                  >
                    ${email}
                  </a>
                </p>

              </div>

              <h3 style="
                margin: 0 0 10px;
                color: #111827;
              ">
                Message
              </h3>

              <div style="
                background: #f9fafb;
                border-left: 4px solid #6366f1;
                padding: 18px;
                border-radius: 8px;
                line-height: 1.6;
                white-space: pre-wrap;
              ">
                ${message}
              </div>

              <!-- Reply Button -->
              <div style="
                text-align: center;
                margin-top: 30px;
              ">
                <a
                  href="mailto:${email}"
                  style="
                    display: inline-block;
                    background: #6366f1;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 13px 25px;
                    border-radius: 8px;
                    font-weight: bold;
                  "
                >
                  Reply to ${name}
                </a>
              </div>

            </div>

            <!-- Footer -->
            <div style="
              background: #f8fafc;
              padding: 18px;
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
            ">
              This message was sent from your website contact form.
            </div>

          </div>

        </body>
        </html>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("EMAIL ERROR FULL:", error);
    res.status(500).json({ error: error.message });
  }
});

/*
app.post("/send", async (req, res) => {
  console.log("🔥 SEND ROUTE HIT");

  console.log("ENV CHECK:", {
    EMAIL: !!process.env.EMAIL,
    EMAILTO: !!process.env.EMAILTO,
    PASSWORD: !!process.env.PASSWORD,
  });

  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      family: 4, // 🔥 forces IPv4 (important)
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAILTO,
      subject: "New Contact Form Furqan Life",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("EMAIL ERROR FULL:", error);
    res.status(500).json({ error: error.message });
  }
});
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// error handling
app.use(notFound);
app.use(errorHandler);
