import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { upsertStreamUser } from "../lib/stream.js";

// --- SIGNUP ---
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
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomavatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${idx}`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomavatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
    } catch (err) {
      console.log("Stream user creation failed");
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(201).json({ success: true, user: newUser });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- LOGIN ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- LOGOUT (Fixed for cross-origin) ---
const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logout successful" });
};


const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, location } = req.body;

    if (!fullName || !bio || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, location, isOnBoard: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (streamErr) {
      console.error("Stream update failed:", streamErr);
    }

    res.status(200).json({
      success: true,
      message: "Onboarding completed",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Onboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const changePassword = async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Both old and new passwords are required" });
  }

  const user = await User.findById(userId);
  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Old password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
};

// --- DELETE ACCOUNT ---
const deleteAccount = async (req, res) => {
  const userId = req.user._id;
  await User.findByIdAndDelete(userId);
  res.status(200).json({ message: "Account deleted successfully" });
};

export {
  signup,
  login,
  logout,
  onboard,
  changePassword,
  deleteAccount,
};
