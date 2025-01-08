import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  // Check Authorization header and Cookies for the token
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1] // Extract token from Bearer schema
    : req.cookies?.token; // Fallback to cookie token

  console.log("Received token:", token); // Debugging log

  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the decoded token
    const user = await User.findById(decodedToken.id);
    if (!user) {
      console.error("User not found for token:", decodedToken.id);
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
