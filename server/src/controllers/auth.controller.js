import axios from "axios";
import { User } from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const TOKEN_COOKIE_NAME = "token";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const redirectToClient = (res, path, params = {}) => {
  const url = new URL(path, CLIENT_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return res.redirect(url.toString());
};

const hasGoogleOAuthConfig = () =>
  Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL,
  );

const setAuthCookie = (res, token) => {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// login route - redirect to Google for authentication
// http://localhost:5000/api/auth/login
export const login = async (_req, res) => {
  if (!hasGoogleOAuthConfig()) {
    return res.status(500).json({
      message: "Google OAuth is not configured",
      success: false,
    });
  }

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
  const { code, error } = req.query;

  if (!hasGoogleOAuthConfig()) {
    return redirectToClient(res, "/login", {
      error: "Google OAuth is not configured",
    });
  }

  if (!code) {
    return redirectToClient(res, "/login", {
      error: error || "Missing authorization code",
    });
  }

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

    const {
      sub: googleId,
      email,
      given_name: givenName,
      family_name: familyName,
      picture,
    } = userInfoResponse.data;
    const displayName =
      [givenName, familyName].filter(Boolean).join(" ") || email;

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

    const token = generateToken(user);
    setAuthCookie(res, token);

    return redirectToClient(res, "/auth/success", {
      token,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const googleError = error.response?.data?.error;
      const googleErrorDescription = error.response?.data?.error_description;

      return redirectToClient(res, "/login", {
        error: googleError || error.message,
        reason: googleErrorDescription,
      });
    }

    return redirectToClient(res, "/login", {
      error: error.message,
    });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logout successful" });
};
