import express from "express";
import cors from "cors";
import morgan from "morgan";
import hisaabRoutes from "./routes/hisaabRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// app.js configures the Express app WITHOUT starting a server or
// connecting to the database. This separation is what makes the app
// testable: Supertest can import this module and send requests
// directly against it in-memory, with no real network port and no
// live MongoDB connection required. index.js remains the actual
// entry point — it imports this, then adds connectDB() + app.listen().
const allowedOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map((origin) => origin.trim());

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
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

// Silence request logging during tests (NODE_ENV=test) — keeps test
// output focused on assertions/failures, not HTTP access logs.
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.get("/", (req, res) => {
  res.status(200).json({ message: "KhaataPushtak API is running 🚀" });
});

app.use("/api/hisaab", hisaabRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
