// notFound runs when a request hits a route that doesn't exist
// anywhere in our app (e.g., GET /api/banana). It creates an error
// and passes it along to errorHandler below via next(error).
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// errorHandler is Express's special 4-argument middleware signature.
// Express automatically routes any next(error) call here, no matter
// which controller it came from. This is our single source of truth
// for how errors look to the client.
export const errorHandler = (err, req, res, next) => {
  // Mongoose "CastError" happens when an invalid ObjectId is passed
  // (e.g., GET /api/hisaab/123 where "123" isn't a valid Mongo _id).
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose validation errors (e.g., missing required field)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack traces in development — never in production,
    // where they could leak internal file paths to attackers.
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
