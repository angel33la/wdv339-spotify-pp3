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
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || "";
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName,
              email,
              imageUrl: profile.photos?.[0]?.value || "",
            });
          } else {
            user.googleId = profile.id;
            user.username = profile.displayName;
            user.imageUrl = profile.photos?.[0]?.value || user.imageUrl;
            await user.save();
          }

          done(null, user);
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
