// asyncHandler wraps an async Express route handler and catches any
// errors it throws, forwarding them to next() so our centralized
// error-handling middleware (middleware/errorHandler.js) can process them.
//
// Without this, EVERY controller function would need its own
// try/catch block — this removes that repetition (DRY principle).
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
