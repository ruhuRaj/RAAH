const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  // --- REMOVED: Previous bypass logic for GET /api/grievances is no longer needed here
  //              as specific routes are now made public in their respective router files.

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // --- DEBUGGING JWT_SECRET AND TOKEN (Keep for now, but remove in production) ---
      console.log("Backend Protect Middleware: Received Token:", token);
      console.log("Backend Protect Middleware: JWT_SECRET used for verification:", process.env.JWT_SECRET);
      // --- END DEBUGGING ---

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found for token payload');
      }
      
      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error("Authentication Error: Token failed -", error.message);
      if (error.name === 'TokenExpiredError') {
          console.error("Token Expired at:", error.expiredAt);
      } else if (error.name === 'JsonWebTokenError') {
          console.error("Invalid Token Signature/Format Error:", error.message);
      }
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    // This 'else' block will now correctly trigger if a protected route is accessed without a token
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const authorizeAccountType = (...accountTypes) => {
    return (req, res, next) => {
        if(!req.user || !accountTypes.includes(req.user.accountType)){
            res.status(403);
            throw new Error('Not authorized to access this route');
        }
        next();
    };
};

module.exports = { protect, authorizeAccountType };
