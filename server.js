import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import authRoutes from "./routes/authRoutes.js";

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
      to: "furqanlife0912@gmail.com",
      subject: "Furqan Life",
      html: `<p>Name: ${name}\nEmail: ${email}\n <strong>Message: ${message}</strong>!</p>`,
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

// error handling
app.use(notFound);
app.use(errorHandler);