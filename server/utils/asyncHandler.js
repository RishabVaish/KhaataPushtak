// asyncHandler wraps an async Express route handler and catches any
// errors it throws, forwarding them to next() so our centralized
// error-handling middleware (middleware/errorHandler.js) can process them.
//
// Without this, EVERY controller function would need its own
// try/catch block — this removes that repetition (DRY principle).
//
// BUG FIX (found via testing): the original version did NOT return
// the promise chain — it just fired `Promise.resolve(fn(...)).catch(next)`
// without returning it. Express itself never noticed, since Express
// doesn't await middleware return values anyway (fire-and-forget).
// But it meant nothing else could reliably `await` a wrapped handler
// to know when it actually finished — including our own tests, which
// surfaced this as a real, order-dependent race condition. Returning
// the promise fixes that for every current and future caller.
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
