import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://furqan-life.netlify.app"],
    credentials: true,
  }),
);

app.options(/.*/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/send", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("ENV CHECK:", {
      EMAIL: process.env.EMAIL,
      EMAILTO: process.env.EMAILTO,
      PASSWORD: process.env.PASSWORD ? "exists" : "missing",
    });

    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
