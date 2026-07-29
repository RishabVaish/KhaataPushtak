import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import hisaabRoutes from "./routes/hisaabRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

dotenv.config();
connectDB();

const app = express();

// ── CORS ─────────────────────────────────────────────────
// CLIENT_URL supports a COMMA-SEPARATED list — production needs
// this because Vercel issues a distinct preview URL for every
// branch/PR deploy IN ADDITION TO the main production domain. A
// single hardcoded origin would block every preview deployment.
// Example: CLIENT_URL=https://khaatapushtak.vercel.app,https://khaatapushtak-git-dev.vercel.app
const allowedOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // `origin` is undefined for same-origin requests / server-to-server
      // tools like Postman/curl — allow those through.
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
  }),
);

app.use(express.json());

// ── Request logging ──────────────────────────────────────
// "dev" format (colored, concise) locally; "combined" (Apache-style,
// includes response time and status) in production, which is what
// Render's log viewer and most log aggregators expect.
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── Routes ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({ message: "KhaataPushtak API is running 🚀" });
});

<<<<<<< HEAD
// Mount all /api/hisaab/* routes.
app.use("/hisaab", hisaabRoutes);
// Mount all /api/auth/* routes.
=======
app.use("/hisaab", hisaabRoutes);
>>>>>>> def2a90 (feat: production hardening and deployment optimization)
app.use("/auth", authRoutes);

// ── Error Handling (must be registered LAST) ────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// ── Crash safety ─────────────────────────────────────────
// Without these, an unexpected rejected Promise or thrown error
// outside Express's own error handling can crash the Node process
// with NO log explaining why — turning a debuggable bug into a
// mysterious 3am outage. We log clearly, then exit so the hosting
// platform (Render) can restart the process cleanly.
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});
