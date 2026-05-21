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
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
);

app.options(/.*/, cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/send", async (req, res) => {
  try {
    console.log("ENV CHECK:", {
      EMAIL: process.env.EMAIL,
      EMAILTO: process.env.EMAILTO,
      PASSWORD_EXISTS: !!process.env.PASSWORD,
    });

    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAILTO,
      subject: "New Contact Form Furqan Life",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("EMAIL ERROR FULL:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Example: simple check (replace with DB)
  if (email !== "test@gmail.com" || password !== "1234") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, "SECRET_KEY", { expiresIn: "1h" });

  res.json({ token });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
