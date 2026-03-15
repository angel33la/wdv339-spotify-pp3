import axios from "axios";
import { User } from "../models/User.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

// login route - redirect to Google for authentication
// http://localhost:5000/api/auth/login
export const login = async (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: "email profile",
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
    return res.status(404).json({
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
        code,
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
    const {
      id,
      sub: googleId,
      email,
      given_name: givenName,
      family_name: familyName,
      picture,
    } = userInfoResponse.data;
    const displayName =
      [givenName, familyName].filter(Boolean).join(" ") || email;

    // Save user to mongodb (create new or update existing by googleId or email)
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = new User();
    }

    user.googleId = googleId;
    user.email = email;
    user.username = displayName;
    user.imageUrl = picture;
    user.access_token = access_token;
    user.expires_in = expires_in;
    user.refresh_token = refresh_token;
    await user.save();

    return res.status(200).json({
      message: "Auth callback route is active",
      data: {
        googleId: user.googleId,
        email: user.email,
        username: user.username,
        imageUrl: user.imageUrl,
        access_token: user.access_token,
        expires_in: user.expires_in,
        refresh_token: user.refresh_token,
        id: user._id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        __v: user.__v,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const googleError = error.response?.data?.error;
      const googleErrorDescription = error.response?.data?.error_description;

      console.error("Google OAuth callback failed", {
        statusCode,
        googleError,
        googleErrorDescription,
        responseData: error.response?.data,
      });

      return res.status(statusCode).json({
        message: "Error occurred during Google authentication",
        success: false,
        error: googleError || error.message,
        error_description: googleErrorDescription,
      });
    }

    console.error("Unexpected OAuth callback error", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      keyPattern: error?.keyPattern,
      keyValue: error?.keyValue,
    });

    return res.status(500).json({
      message: "Unexpected server error during Google authentication",
      success: false,
      error: error.message,
    });
  }
};

// logout route - simply respond with success message (client will handle token deletion)
export const logout = async (_req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
