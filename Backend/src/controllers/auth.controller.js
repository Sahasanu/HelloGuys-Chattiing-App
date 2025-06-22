import User from "../models/user.js";
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../lib/stream.js";

const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already Taken, Use another" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomavatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomavatar
    });
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",

      });
      console.log("Stream user created for this new user")
    } catch (error) {
      console.log("Error")
    }


    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });

    res.status(201).json({ success: true, user: newUser });

  } catch (error) {
    console.error("Error in sign up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.log('Error in login controller:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful" });
};

const onboard = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { fullName, bio, location } = req.body;

    // ✅ Validate required fields
    if (!fullName || !bio || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        location,
        isOnBoard: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update Stream user
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (streamErr) {
      console.error("Error updating Stream user:", streamErr);
      // Still succeed onboarding if Stream update fails (optional)
      return res.status(500).json({ message: "Failed to sync Stream user" });
    }

    // ✅ Success
    return res.status(200).json({
      success: true,
      message: "Onboarding completed",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error in onboarding:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};





export { signup, login, logout, onboard };