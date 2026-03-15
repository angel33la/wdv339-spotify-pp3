import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../src/models/User.js";

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            avatar: profile.photos?.[0]?.value || "",
          });

          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      },
    ),
  );
} else {
  console.warn(
    "Google OAuth is disabled because required environment variables are missing.",
  );
}
