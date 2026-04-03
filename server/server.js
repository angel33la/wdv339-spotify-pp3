import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import "./config/passport.js";

import { connectDB } from "./config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import searchRoutes from "./src/routes/search.route.js";
import playlistRoutes from "./src/routes/playlist.route.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/playlists", playlistRoutes);

// Serve React frontend (CRA)
const clientPath = path.join(__dirname, "../client/build");
app.use(express.static(clientPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
