import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const ACCESS_TOKEN_COOKIE_NAME = "token";
const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const getRefreshSecret = () =>
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

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

const setAccessTokenCookie = (res, token) => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
};

const clearAuthCookies = (res) => {
  const options = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, options);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, options);
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id }, getRefreshSecret(), { expiresIn: "7d" });

const persistRefreshToken = async (user, refreshToken) => {
  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await user.save();
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
    const refreshToken = createRefreshToken(user);

    await persistRefreshToken(user, refreshToken);
    setAccessTokenCookie(res, token);
    setRefreshTokenCookie(res, refreshToken);

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
  const refreshToken = _req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
  if (refreshToken) {
    const hashed = hashToken(refreshToken);
    await User.findOneAndUpdate(
      { refreshTokenHash: hashed },
      { $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 } },
    );
  }

  clearAuthCookies(res);

  res.status(200).json({ message: "Logout successful" });
};

export const me = async (req, res) => {
  res.status(200).json(req.user);
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(refreshToken, getRefreshSecret());
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const isExpired =
      new Date(user.refreshTokenExpiresAt).getTime() < Date.now();
    const hashedIncoming = hashToken(refreshToken);
    if (isExpired || hashedIncoming !== user.refreshTokenHash) {
      return res
        .status(401)
        .json({ message: "Refresh token expired or invalid" });
    }

    const newAccessToken = generateToken(user);
    const newRefreshToken = createRefreshToken(user);

    await persistRefreshToken(user, newRefreshToken);
    setAccessTokenCookie(res, newAccessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({ token: newAccessToken });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
