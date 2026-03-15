import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import cookieParser from "cookie-parser";
import "./config/passport.js";

import { connectDB } from "./config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import searchRoutes from "./src/routes/search.route.js";
import playlistRoutes from "./src/routes/playlist.route.js";

dotenv.config();
const app = express();

connectDB();
app.use(morgan("dev"));


const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/playlists", playlistRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the WDV339-SPOTIFY-PP3 APP Backend!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
