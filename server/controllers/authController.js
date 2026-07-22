import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Basic presence validation — schema validation is our second line
  // of defense, but checking here lets us return a clean 400 early
  // instead of relying on a raw Mongoose ValidationError.
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  // Check for an existing user BEFORE attempting to create one.
  // This gives a clear, friendly error instead of a raw MongoDB
  // "duplicate key" error bubbling up from the unique index.
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  // Password hashing happens automatically via the pre-save hook
  // in models/User.js — we never touch bcrypt here.
  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    },
    message: "User registered successfully",
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // .select("+password") overrides the schema's `select: false`
  // JUST for this query — we need the hash to compare against,
  // but we still don't want it selected by default everywhere else.
  const user = await User.findOne({ email }).select("+password");

  // Deliberately vague error message — "Invalid credentials" (not
  // "user not found" vs "wrong password"). Being specific here
  // tells an attacker whether an email is registered (info leak).
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    },
    message: "Login successful",
  });
});

// @desc    Get current logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private (requires valid JWT)
export const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is attached by authMiddleware.js after verifying the
  // JWT — by the time we reach this controller, we already KNOW
  // the request is authenticated. This handler just fetches data.
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});
