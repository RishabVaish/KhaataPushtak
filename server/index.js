import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import hisaabRoutes from "./routes/hisaabRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Load environment variables from .env into process.env
// MUST be called before we use process.env anywhere below.
dotenv.config();

// Connect to MongoDB Atlas before the server starts accepting traffic.
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────
// cors() allows our React frontend (different origin/port) to
// make requests to this API. Without it, browsers block the
// requests due to the Same-Origin Policy.
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// express.json() parses incoming JSON request bodies into req.body.
// Without this, req.body would be undefined on POST/PUT requests.
app.use(express.json());

// ── Routes ───────────────────────────────────────────────
// Simple health-check route — useful for confirming the API is
// alive (and for deployment platforms like Render to ping).
app.get("/", (req, res) => {
  res.status(200).json({ message: "KhaataPushtak API is running 🚀" });
});

// Mount all /api/hisaab/* routes.
app.use("/api/hisaab", hisaabRoutes);

// Mount all /api/auth/* routes.
app.use("/api/auth", authRoutes);

// ── Error Handling (must be registered LAST) ────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
