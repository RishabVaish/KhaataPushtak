import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// protect is applied to any route that requires a logged-in user.
// It reads the Authorization header, verifies the JWT, and attaches
// the corresponding user document to req.user for downstream use.
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    let decoded;

    // Only JWT verification itself belongs in this try/catch — it's
    // the only step that can throw for "invalid/expired token"
    // reasons. Bug fixed here: the "user no longer exists" check
    // used to live INSIDE this try block, so its specific error
    // message was being silently swallowed by the catch below and
    // replaced with the generic "invalid or expired" message. Moving
    // it outside preserves the more useful, accurate message.
    try {
      token = authHeader.split(" ")[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token invalid or expired");
    }

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      throw new Error("User belonging to this token no longer exists");
    }

    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});
