import axios from "axios";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

// login route - redirect to Google for authentication
export const login = async (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  res.redirect(authUrl);
};

// Google OAuth callback route
export const callback = async (req, res) => {
  console.log("=== OAUTH CALLBACK STARTED ===");
  const { code, error } = req.query;
  console.log("Query params:", { code, error });
  if (!code) {
    return res
      .status(404)
      .json({
        message: "Error occurred during Google authentication",
        success: false,
        error,
      });
  }

  // final handshake with Google to exchange code for tokens and get user info
  try {
    const tokenResponse = await axios.post(
      GOOGLE_TOKEN_URL,
      new URLSearchParams({
        code: req.query.code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    const { access_token, expires_in, refresh_token } = tokenResponse.data;

    const userInfoResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log("User data", userInfoResponse.data);
    // const { id, email, name, picture } = userInfoResponse.data;
    return res
      .status(200)
      .json({ message: "Auth callback route is active", data: userInfoResponse.data });
  } catch (error) {
    return res.status(404).json({
      message: "Error occurred during Google authentication",
      success: false,
      error: error.message,
    });
  }


  /*  let user = await User.findOne({ googleId: id });

    if (user) {
      // updating existing user
      user.email = email;
      user.username = name;
      user.imageUrl = picture;
      user.access_token = access_token;
      user.expires_in = expires_in;
      user.refresh_token = refresh_token;
      await user.save();
    } else {
      // creating new user
      user = await User.create({
        googleId: id,
        email,
        name,
        imageUrl: picture,
        access_token,
        expires_in,
        refresh_token,
      });
      await user.save();
    }

    console.log("Received callback with query:", req.query);
    const { code, error } = req.query;

    if (!code) {
      return res
        .status(404)
        .json({
          message: "Error occurred during Google authentication",
          success: false,
          error,
        });
    }
    
  
};*/

};

// logout route - simply respond with success message (client will handle token deletion)
export const logout = async (_req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
