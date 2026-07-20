import Hisaab from "../models/Hisaab.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all hisaabs (supports search, category filter, sort)
// @route   GET /api/hisaab
// @access  Public
export const getHisaabs = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;

  // Build a MongoDB query object dynamically based on what
  // query params the client actually sent.
  const query = {};

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

  const hisaabs = await Hisaab.find(query).sort(sortOrder);

  res.status(200).json({
    success: true,
    count: hisaabs.length,
    data: hisaabs,
  });
});

// @desc    Get a single hisaab by ID
// @route   GET /api/hisaab/:id
// @access  Public
export const getHisaabById = asyncHandler(async (req, res) => {
  const hisaab = await Hisaab.findById(req.params.id);

  if (!hisaab) {
    res.status(404);
    throw new Error("Hisaab not found");
  }

  res.status(200).json({
    success: true,
    data: hisaab,
  });
});

// @desc    Create a new hisaab
// @route   POST /api/hisaab
// @access  Public
export const createHisaab = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  // Mongoose schema validation (required, enum) runs automatically
  // on .create() — if it fails, it throws a ValidationError which
  // our centralized errorHandler catches and formats.
  const hisaab = await Hisaab.create({ title, content, category });

  res.status(201).json({
    success: true,
    data: hisaab,
    message: "Hisaab created successfully",
  });
});

// @desc    Update an existing hisaab
// @route   PUT /api/hisaab/:id
// @access  Public
export const updateHisaab = asyncHandler(async (req, res) => {
  const hisaab = await Hisaab.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // return the UPDATED document, not the original
      runValidators: true, // re-run schema validation on update
    }
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

// @desc    Delete a hisaab
// @route   DELETE /api/hisaab/:id
// @access  Public
export const deleteHisaab = asyncHandler(async (req, res) => {
  const hisaab = await Hisaab.findByIdAndDelete(req.params.id);

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
