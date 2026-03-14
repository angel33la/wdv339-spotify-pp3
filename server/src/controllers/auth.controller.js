import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

import GOOGLE_AUTH_URL from "https://accounts.google.com/o/oauth2/v2/auth";
import GOOGLE_TOKEN_URL from "https://oauth2.googleapis.com/token";
import GOOGLE_USERINFO_URL from "https://www.googleapis.com/oauth2/v3/userinfo";

// login route - redirect to Google for authentication
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Proceed with JWT token generation for session
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Google OAuth callback route
export const callback = async (req, res) => {
  res.status(200).json({ message: "Auth callback route is active" });
};


// logout route - simply respond with success message (client will handle token deletion)
export const logout = async (_req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
