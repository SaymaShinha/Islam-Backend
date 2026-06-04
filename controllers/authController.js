import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    console.log("register");
    const { name, email, password, nativeLanguage, city, area, phone } =
      req.body;

    console.log(req);
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      nativeLanguage: nativeLanguage.toLowerCase(),
      addresses: [
        {
          phone,
          address: area,
          city,
        },
      ],
    });

    console.log(user);
    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// registerByGoogleAcc
export const registerByGoogleAcc = async (req, res) => {
  try {
    const { uid, email, name, photo } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email missing" });
    }

    // use ONE model only
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        uid,
        email,
        name,
        photo,
        authProvider: "google",
      });
    }

    // ALWAYS respond (this fixes your 500 issue)
    return res.status(200).json({
      message: "User login successful",
      user,
    });
  } catch (error) {
    console.log("Google Auth Error:", error);
    return res.status(500).json({ message: error.message });
  }
};



// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    console.log("user");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
