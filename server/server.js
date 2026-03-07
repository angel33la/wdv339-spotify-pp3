import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import { initializeSocket } from "./config/socket.js";

import { connectDB } from "./config/db.js";
import userRoutes from "./src/routes/user.route.js";
import adminRoutes from "./src/routes/admin.route.js";
import authRoutes from "./src/routes/auth.route.js";
import songRoutes from "./src/routes/song.route.js";
import albumRoutes from "./src/routes/album.route.js";

dotenv.config();
const app = express();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors());

const hasClerkKeys =
  Boolean(process.env.CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

if (hasClerkKeys) {
  app.use(clerkMiddleware());
} else {
  console.warn(
    "Clerk keys are missing. Running without Clerk middleware; protected routes will return 401.",
  );
  app.use((req, _res, next) => {
    req.auth = {};
    next();
  });
}

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB  max file size
    },
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the WDV339-SPOTIFY-PP3 APP Backend!");
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
