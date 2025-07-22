
const errorHandler = (err, req, res, next) => {
  // Determine the status code. If the error has a statusCode property, use it.
  // Otherwise, default to 500 (Internal Server Error).
  // If res.statusCode is 200, it means no specific status was set yet, so default to 500.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Set the response status code
  res.status(statusCode);

  // Send a JSON response for all errors
  res.json({
    message: err.message, // The error message from the thrown error (e.g., "Not authorized, no token")
    // Include the stack trace only in development mode for debugging.
    // In production, you should omit the stack trace for security reasons.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;