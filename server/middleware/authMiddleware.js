import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// protect is applied to any route that requires a logged-in user.
// It reads the Authorization header, verifies the JWT, and attaches
// the corresponding user document to req.user for downstream use.
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Standard convention: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Extract just the token part (splits "Bearer xyz123" -> "xyz123")
      token = authHeader.split(" ")[1];

      // jwt.verify throws if the signature is invalid OR if the
      // token has expired — both cases are caught below.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (without password) to the request object.
      // Every downstream handler can now read req.user.
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401);
        throw new Error("User belonging to this token no longer exists");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token invalid or expired");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});
