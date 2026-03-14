import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: String,
    imageUrl: String,
    access_token: String,
    expires_in: Number,
    refresh_token: String,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
