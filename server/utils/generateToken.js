import jwt from "jsonwebtoken";

// generateToken signs a JWT containing the user's ID as its payload.
// We deliberately keep the payload minimal — just the ID — because
// the token is decoded on EVERY protected request, and anything
// sensitive inside it is visible to anyone who can read the token
// (JWTs are signed, not encrypted).
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token auto-expires in 30 days, forcing re-login
  });
};

export default generateToken;
