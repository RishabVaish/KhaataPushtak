import Hisaab from "../models/Hisaab.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all hisaabs BELONGING TO THE LOGGED-IN USER
//          (supports search, category filter, sort)
// @route   GET /api/hisaab
// @access  Private
export const getHisaabs = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;

  // Ownership filter — ALWAYS included, never optional. Every other
  // filter (search/category) is ADDED on top of this base constraint,
  // so a user can never accidentally (or maliciously) query outside
  // their own data.
  const query = { user: req.user._id };

  if (search) {
    // $regex with 'i' option = case-insensitive partial match.
    // $or means: match if EITHER title OR content contains the term.
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "All") {
    query.category = category;
  }

  // Default sort: newest first. Client can pass ?sort=oldest to flip it.
  const sortOrder = sort === "oldest" ? "createdAt" : "-createdAt";

  // .populate("user", "name email avatar") replaces the raw user
  // ObjectId with the actual user document (only these 3 fields —
  // never populate password, even though select:false already
  // excludes it by default, this is defense-in-depth).
  const hisaabs = await Hisaab.find(query)
    .sort(sortOrder)
    .populate("user", "name email avatar");

  res.status(200).json({
    success: true,
    count: hisaabs.length,
    data: hisaabs,
  });
});

// @desc    Get a single hisaab by ID (only if it belongs to the user)
// @route   GET /api/hisaab/:id
// @access  Private
export const getHisaabById = asyncHandler(async (req, res) => {
  // Compound filter: must match BOTH the ID and the owner. If a
  // Hisaab with this ID exists but belongs to someone else, this
  // returns null — same as if it didn't exist at all. We never leak
  // "this exists but isn't yours."
  const hisaab = await Hisaab.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("user", "name email avatar");

  if (!hisaab) {
    res.status(404);
    throw new Error("Hisaab not found");
  }

  res.status(200).json({
    success: true,
    data: hisaab,
  });
});

// @desc    Create a new hisaab, owned by the logged-in user
// @route   POST /api/hisaab
// @access  Private
export const createHisaab = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  // user is NEVER taken from req.body — it is derived exclusively
  // from the verified JWT (req.user, set by authMiddleware). This
  // is the single most important line in this file: it's what makes
  // it impossible for a client to create a Hisaab on someone else's
  // behalf, even if they tamper with the request body.
  const hisaab = await Hisaab.create({
    title,
    content,
    category,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: hisaab,
    message: "Hisaab created successfully",
  });
});

// @desc    Update a hisaab (only if it belongs to the user)
// @route   PUT /api/hisaab/:id
// @access  Private
export const updateHisaab = asyncHandler(async (req, res) => {
  // Whitelist exactly which fields a client is allowed to change.
  // We deliberately do NOT spread req.body directly — if we did, a
  // malicious client could sneak {"user": "<someone_else_id>"} into
  // the request and reassign ownership of the document. Only these
  // three fields are ever accepted, regardless of what else is sent.
  const { title, content, category } = req.body;
  const updates = { title, content, category };

  // Same compound-filter pattern as getHisaabById. findOneAndUpdate
  // will simply not match (and return null) if this Hisaab belongs
  // to a different user — no separate "is this mine?" check needed,
  // the query itself enforces ownership atomically.
  const hisaab = await Hisaab.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    {
      new: true, // return the UPDATED document, not the original
      runValidators: true, // re-run schema validation on update
    },
  );

  if (!hisaab) {
    res.status(404);
    throw new Error("Hisaab not found");
  }

  res.status(200).json({
    success: true,
    data: hisaab,
    message: "Hisaab updated successfully",
  });
});

// @desc    Delete a hisaab (only if it belongs to the user)
// @route   DELETE /api/hisaab/:id
// @access  Private
export const deleteHisaab = asyncHandler(async (req, res) => {
  const hisaab = await Hisaab.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!hisaab) {
    res.status(404);
    throw new Error("Hisaab not found");
  }

  res.status(200).json({
    success: true,
    data: {},
    message: "Hisaab deleted successfully",
  });
});
